-- Enable RLS for transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access to transactions table (temporary solution)
CREATE POLICY "Allow public access to transactions"
  ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);
