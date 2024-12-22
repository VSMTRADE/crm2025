-- Update tasks table priority values
DO $$ 
DECLARE
    r RECORD;
BEGIN 
    -- Drop existing check constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
              WHERE table_name = 'tasks' AND constraint_name = 'tasks_priority_check') THEN
        ALTER TABLE tasks DROP CONSTRAINT tasks_priority_check;
    END IF;

    -- Update column type and default if needed
    ALTER TABLE tasks 
    ALTER COLUMN priority TYPE VARCHAR(10),
    ALTER COLUMN priority SET DEFAULT 'medio';

    -- Update existing data to new priority values
    UPDATE tasks SET priority = 'baixo' WHERE priority IN ('low', 'baixa', 'Low', 'LOW');
    UPDATE tasks SET priority = 'medio' WHERE priority IN ('medium', 'media', 'Medium', 'MEDIUM');
    UPDATE tasks SET priority = 'alto' WHERE priority IN ('high', 'alta', 'High', 'HIGH');

    -- Add new check constraint with updated priority values
    ALTER TABLE tasks 
    ADD CONSTRAINT tasks_priority_check 
    CHECK (priority = ANY (ARRAY['baixo', 'medio', 'alto']::VARCHAR[]));

    -- Verify the changes
    RAISE NOTICE 'Current priority values after update:';
    FOR r IN SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority LOOP
        RAISE NOTICE 'Priority: %, Count: %', r.priority, r.count;
    END LOOP;
END $$;
