-- Primeiro, remover a constraint existente
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_status_check;

-- Atualizar os valores existentes para português
UPDATE transactions 
SET status = 
  CASE 
    WHEN status = 'pending' THEN 'pendente'
    WHEN status = 'completed' THEN 'concluido'
    WHEN status = 'cancelled' THEN 'cancelado'
    ELSE 'pendente'
  END;

-- Adicionar a nova constraint com os valores em português
ALTER TABLE transactions
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pendente', 'concluido', 'cancelado'));

-- Garantir que o tipo está correto
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_type_check;

ALTER TABLE transactions
ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('receita', 'despesa'));
