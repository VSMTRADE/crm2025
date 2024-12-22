-- Primeiro, atualizar os valores existentes
UPDATE transactions 
SET type = 
  CASE 
    WHEN type = 'income' THEN 'receita'
    WHEN type = 'expense' THEN 'despesa'
    WHEN type = 'revenue' THEN 'receita'
    ELSE 'receita' -- valor padrão
  END;

-- Remover a constraint existente se houver
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_type_check;

-- Adicionar a nova constraint
ALTER TABLE transactions
ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('receita', 'despesa'));

-- Remover a constraint de status existente
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_status_check;

-- Atualizar os status
UPDATE transactions 
SET status = 
  CASE 
    WHEN status = 'pending' THEN 'pendente'
    WHEN status = 'completed' THEN 'concluido'
    WHEN status = 'cancelled' THEN 'cancelado'
    ELSE 'pendente'
  END;

-- Adicionar a nova constraint de status
ALTER TABLE transactions
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pendente', 'concluido', 'cancelado'));
