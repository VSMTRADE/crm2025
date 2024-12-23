-- Remover a constraint existente
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

-- Garantir que a coluna status existe e tem o tipo correto
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'transactions' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE transactions ADD COLUMN status TEXT;
    END IF;
END $$;

-- Definir valor padrão
ALTER TABLE transactions ALTER COLUMN status SET DEFAULT 'pending';

-- Atualizar registros existentes que estejam nulos
UPDATE transactions SET status = 'pending' WHERE status IS NULL;

-- Converter todos os valores para lowercase
UPDATE transactions 
SET status = LOWER(status) 
WHERE status IS NOT NULL;

-- Adicionar a constraint novamente com valores em lowercase
ALTER TABLE transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled'));
