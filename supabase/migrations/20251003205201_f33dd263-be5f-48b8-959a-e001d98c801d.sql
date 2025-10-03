-- Create faucet_claims table to track token distributions
CREATE TABLE public.faucet_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  ip_address INET,
  amount NUMERIC NOT NULL,
  transaction_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_faucet_claims_wallet ON faucet_claims(wallet_address);
CREATE INDEX idx_faucet_claims_ip ON faucet_claims(ip_address);
CREATE INDEX idx_faucet_claims_claimed_at ON faucet_claims(claimed_at);

-- Enable RLS
ALTER TABLE public.faucet_claims ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view their own claims
CREATE POLICY "Users can view faucet claims"
ON public.faucet_claims
FOR SELECT
USING (true);

-- Policy: Service role can insert claims
CREATE POLICY "Service role can insert claims"
ON public.faucet_claims
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Policy: Service role can update claims
CREATE POLICY "Service role can update claims"
ON public.faucet_claims
FOR UPDATE
USING (auth.role() = 'service_role');

-- Create faucet_config table for dynamic configuration
CREATE TABLE public.faucet_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faucet_config ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read config
CREATE POLICY "Anyone can read faucet config"
ON public.faucet_config
FOR SELECT
USING (true);

-- Policy: Service role can manage config
CREATE POLICY "Service role can manage config"
ON public.faucet_config
FOR ALL
USING (auth.role() = 'service_role');

-- Insert default configuration
INSERT INTO public.faucet_config (key, value, description) VALUES
  ('claim_amount', '"0.1"', 'Amount of tokens to distribute per claim'),
  ('claim_cooldown_hours', '24', 'Hours between claims for same wallet'),
  ('max_daily_claims', '100', 'Maximum total claims per day'),
  ('enabled', 'true', 'Whether faucet is currently enabled');

-- Create trigger for updated_at
CREATE TRIGGER update_faucet_claims_updated_at
BEFORE UPDATE ON public.faucet_claims
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faucet_config_updated_at
BEFORE UPDATE ON public.faucet_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();