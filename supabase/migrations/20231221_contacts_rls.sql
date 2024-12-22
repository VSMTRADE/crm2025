-- Enable RLS for contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access to contacts table (temporary solution)
CREATE POLICY "Allow public access to contacts"
  ON contacts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Alternative: If you want to restrict access to authenticated users only
-- CREATE POLICY "Allow authenticated access to contacts"
--   ON contacts
--   FOR ALL
--   USING (auth.role() = 'authenticated')
--   WITH CHECK (auth.role() = 'authenticated');
