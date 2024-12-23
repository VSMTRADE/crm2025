-- Verificar e corrigir a estrutura da tabela transactions
DO $$ 
BEGIN 
    -- Remover constraint existente
    ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

    -- Atualizar valores nulos ou inválidos
    UPDATE transactions 
    SET status = 'completed' 
    WHERE status IS NULL OR status NOT IN ('pending', 'completed', 'cancelled');

    -- Adicionar nova constraint
    ALTER TABLE transactions
    ADD CONSTRAINT transactions_status_check 
    CHECK (status::text IN ('pending', 'completed', 'cancelled'));

    -- Garantir que a coluna não seja nula
    ALTER TABLE transactions 
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN status SET DEFAULT 'completed';
END $$;
