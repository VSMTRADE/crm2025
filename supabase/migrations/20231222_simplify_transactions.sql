-- Remover a constraint existente
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

-- Definir um valor padrão simples
ALTER TABLE transactions ALTER COLUMN status SET DEFAULT 'completed';

-- Atualizar registros existentes
UPDATE transactions SET status = 'completed' WHERE status IS NULL;

-- Adicionar a constraint novamente
ALTER TABLE transactions ADD CONSTRAINT transactions_status_check 
CHECK (status = 'completed');
