-- Remover a constraint existente
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

-- Definir valor padrão
ALTER TABLE transactions ALTER COLUMN status SET DEFAULT 'completed';

-- Atualizar registros existentes que estejam nulos
UPDATE transactions SET status = 'completed' WHERE status IS NULL;

-- Adicionar a constraint novamente
ALTER TABLE transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled'));
