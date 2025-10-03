import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

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

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: 'Wallet address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
        JSON.stringify({ 
          eligible: false, 
          reason: 'Faucet is currently disabled',
          nextClaimTime: null 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check last claim for this wallet
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
            eligible: false,
            reason: `You can claim again in ${Math.ceil((nextClaimTime.getTime() - now.getTime()) / 1000 / 60)} minutes`,
            nextClaimTime: nextClaimTime.toISOString(),
            lastClaimTime: lastClaimTime.toISOString()
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        eligible: true,
        claimAmount: config.claim_amount || '0.1',
        nextClaimTime: null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking eligibility:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});