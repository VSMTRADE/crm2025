-- Add title column to transactions table
DO $$ 
BEGIN 
    -- Add title column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'transactions' 
        AND column_name = 'title'
    ) THEN
        ALTER TABLE transactions 
        ADD COLUMN title VARCHAR(255) NOT NULL;
    END IF;
END $$;
