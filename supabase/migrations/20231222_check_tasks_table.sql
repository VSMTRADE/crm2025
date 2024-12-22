-- Check current state of tasks table
DO $$ 
DECLARE
    constraint_exists boolean;
    constraint_definition text;
    r record;
BEGIN
    -- Check if the constraint exists
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.constraint_column_usage 
        WHERE table_name = 'tasks' 
        AND constraint_name = 'tasks_priority_check'
    ) INTO constraint_exists;

    RAISE NOTICE 'Constraint exists: %', constraint_exists;

    -- Get constraint definition if it exists
    IF constraint_exists THEN
        SELECT pg_get_constraintdef(oid) 
        FROM pg_constraint 
        WHERE conname = 'tasks_priority_check' 
        INTO constraint_definition;
        
        RAISE NOTICE 'Constraint definition: %', constraint_definition;
    END IF;

    -- Check current priority values in use
    RAISE NOTICE 'Current priority values in use:';
    FOR r IN (
        SELECT priority, COUNT(*) as count
        FROM tasks 
        GROUP BY priority
    ) LOOP
        RAISE NOTICE 'Priority: %, Count: %', r.priority, r.count;
    END LOOP;
END $$;
