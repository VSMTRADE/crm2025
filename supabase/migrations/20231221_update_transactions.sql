-- Update transactions table to match the TypeScript type
DO $$ 
BEGIN 
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'transactions' AND column_name = 'status') THEN
        ALTER TABLE transactions ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'completed';
    END IF;

    -- Add constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
                  WHERE table_name = 'transactions' AND constraint_name = 'transactions_status_check') THEN
        ALTER TABLE transactions
        ADD CONSTRAINT transactions_status_check 
        CHECK (status IN ('pending', 'completed', 'cancelled'));
    END IF;
END $$;
