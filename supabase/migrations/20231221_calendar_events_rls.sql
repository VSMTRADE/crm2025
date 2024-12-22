-- Enable RLS for calendar_events table
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access to calendar_events table (temporary solution)
CREATE POLICY "Allow public access to calendar_events"
  ON calendar_events
  FOR ALL
  USING (true)
  WITH CHECK (true);
