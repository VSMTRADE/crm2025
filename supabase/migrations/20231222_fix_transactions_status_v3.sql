-- Remover a constraint existente
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

-- Garantir que a coluna status existe e tem o tipo correto
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'transactions' AND column_name = 'status') THEN
        ALTER TABLE transactions ADD COLUMN status VARCHAR(20);
    END IF;
END $$;

-- Definir valor padrão
ALTER TABLE transactions ALTER COLUMN status SET DEFAULT 'completed';

-- Atualizar registros existentes que estejam nulos
UPDATE transactions SET status = 'completed' WHERE status IS NULL;

-- Tornar a coluna NOT NULL
ALTER TABLE transactions ALTER COLUMN status SET NOT NULL;

-- Adicionar a constraint novamente
ALTER TABLE transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('completed', 'pending'));
