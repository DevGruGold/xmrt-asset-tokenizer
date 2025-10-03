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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get total claims count
    const { count: totalClaims } = await supabase
      .from('faucet_claims')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get total amount distributed
    const { data: claimsData } = await supabase
      .from('faucet_claims')
      .select('amount')
      .eq('status', 'completed');

    const totalDistributed = claimsData?.reduce((sum, claim) => 
      sum + parseFloat(claim.amount || '0'), 0
    ) || 0;

    // Get user's claim history if wallet provided
    let userClaims = null;
    if (walletAddress) {
      const { data } = await supabase
        .from('faucet_claims')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .order('claimed_at', { ascending: false })
        .limit(10);
      
      userClaims = data;
    }

    return new Response(
      JSON.stringify({
        totalClaims: totalClaims || 0,
        totalDistributed: totalDistributed.toFixed(4),
        userClaims
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error getting faucet stats:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});