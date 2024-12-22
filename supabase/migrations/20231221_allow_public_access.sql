-- Temporarily disable RLS for tasks table
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations without authentication
CREATE POLICY "Allow public access to tasks"
  ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);
