-- Remover e recriar a constraint de status
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

ALTER TABLE transactions
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled'));

-- Garantir que todas as transações existentes tenham um status válido
UPDATE transactions 
SET status = 'completed' 
WHERE status IS NULL OR status NOT IN ('pending', 'completed', 'cancelled');
