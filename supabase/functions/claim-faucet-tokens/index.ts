import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { ethers } from 'npm:ethers@5.7.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress } = await req.json();

    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Get faucet config
    const { data: configData } = await supabase
      .from('faucet_config')
      .select('key, value')
      .in('key', ['enabled', 'claim_cooldown_hours', 'claim_amount']);

    const config = configData?.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, any>);

    // Check if faucet is enabled
    if (!config?.enabled) {
      return new Response(
        JSON.stringify({ error: 'Faucet is currently disabled' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check eligibility
    const cooldownHours = parseInt(config.claim_cooldown_hours || '24');
    const { data: lastClaim } = await supabase
      .from('faucet_claims')
      .select('claimed_at')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('status', 'completed')
      .order('claimed_at', { ascending: false })
      .limit(1)
      .single();

    if (lastClaim) {
      const lastClaimTime = new Date(lastClaim.claimed_at);
      const nextClaimTime = new Date(lastClaimTime.getTime() + cooldownHours * 60 * 60 * 1000);
      const now = new Date();

      if (now < nextClaimTime) {
        return new Response(
          JSON.stringify({ 
            error: 'Too soon to claim again',
            nextClaimTime: nextClaimTime.toISOString()
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const claimAmount = config.claim_amount || '0.1';

    // Create pending claim record
    const { data: claimRecord, error: insertError } = await supabase
      .from('faucet_claims')
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        ip_address: clientIp,
        amount: claimAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating claim record:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to process claim' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get faucet wallet private key from secrets
    const faucetPrivateKey = Deno.env.get('FAUCET_PRIVATE_KEY');
    
    if (!faucetPrivateKey) {
      // Update claim as failed
      await supabase
        .from('faucet_claims')
        .update({ 
          status: 'failed',
          error_message: 'Faucet not configured - missing private key'
        })
        .eq('id', claimRecord.id);

      return new Response(
        JSON.stringify({ error: 'Faucet is not properly configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Connect to Sepolia network
      const provider = new ethers.providers.JsonRpcProvider(
        'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
      );
      
      const wallet = new ethers.Wallet(faucetPrivateKey, provider);

      // Send ETH transaction
      const tx = await wallet.sendTransaction({
        to: walletAddress,
        value: ethers.utils.parseEther(claimAmount)
      });

      console.log('Transaction sent:', tx.hash);

      // Update claim record with transaction hash
      await supabase
        .from('faucet_claims')
        .update({ 
          transaction_hash: tx.hash,
          status: 'pending'
        })
        .eq('id', claimRecord.id);

      // Wait for confirmation in background
      EdgeRuntime.waitUntil(
        (async () => {
          try {
            const receipt = await tx.wait();
            await supabase
              .from('faucet_claims')
              .update({ 
                status: receipt.status === 1 ? 'completed' : 'failed',
                error_message: receipt.status === 1 ? null : 'Transaction failed'
              })
              .eq('id', claimRecord.id);
            console.log('Transaction confirmed:', receipt.transactionHash);
          } catch (error) {
            console.error('Error confirming transaction:', error);
            await supabase
              .from('faucet_claims')
              .update({ 
                status: 'failed',
                error_message: error.message
              })
              .eq('id', claimRecord.id);
          }
        })()
      );

      return new Response(
        JSON.stringify({
          success: true,
          transactionHash: tx.hash,
          amount: claimAmount,
          explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('Error sending transaction:', error);
      
      // Update claim as failed
      await supabase
        .from('faucet_claims')
        .update({ 
          status: 'failed',
          error_message: error.message
        })
        .eq('id', claimRecord.id);

      return new Response(
        JSON.stringify({ error: 'Failed to send tokens: ' + error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in claim-faucet-tokens:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});