-- Create negotiations table if not exists
CREATE TABLE IF NOT EXISTS negotiations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    contact_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    number_of_installments INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create installments table if not exists
CREATE TABLE IF NOT EXISTS installments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    negotiation_id UUID REFERENCES negotiations(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view their own negotiations" ON negotiations;
DROP POLICY IF EXISTS "Users can insert their own negotiations" ON negotiations;
DROP POLICY IF EXISTS "Users can update their own negotiations" ON negotiations;
DROP POLICY IF EXISTS "Users can delete their own negotiations" ON negotiations;
DROP POLICY IF EXISTS "Users can view their own installments" ON installments;
DROP POLICY IF EXISTS "Users can manage their own installments" ON installments;

-- Enable RLS
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;

-- Create policies for negotiations
CREATE POLICY "Users can view their own negotiations"
    ON negotiations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own negotiations"
    ON negotiations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own negotiations"
    ON negotiations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own negotiations"
    ON negotiations FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for installments
CREATE POLICY "Users can view their own installments"
    ON installments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM negotiations
            WHERE negotiations.id = installments.negotiation_id
            AND negotiations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own installments"
    ON installments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM negotiations
            WHERE negotiations.id = installments.negotiation_id
            AND negotiations.user_id = auth.uid()
        )
    );
