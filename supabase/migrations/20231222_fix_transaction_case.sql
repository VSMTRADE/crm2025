-- Primeiro, remover as constraints existentes
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_type_check,
DROP CONSTRAINT IF EXISTS transactions_status_check;

-- Normalizar o case dos tipos
UPDATE transactions 
SET type = LOWER(type);

-- Normalizar o case dos status
UPDATE transactions 
SET status = LOWER(status);

-- Atualizar os valores para o padrão correto
UPDATE transactions 
SET type = 
  CASE 
    WHEN LOWER(type) IN ('income', 'revenue', 'receita') THEN 'receita'
    WHEN LOWER(type) IN ('expense', 'despesa') THEN 'despesa'
    ELSE 'receita'
  END,
status = 
  CASE 
    WHEN LOWER(status) IN ('pending', 'pendente') THEN 'pendente'
    WHEN LOWER(status) IN ('completed', 'complete', 'concluido') THEN 'concluido'
    WHEN LOWER(status) IN ('cancelled', 'canceled', 'cancelado') THEN 'cancelado'
    ELSE 'pendente'
  END;

-- Adicionar as constraints novamente
ALTER TABLE transactions
ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('receita', 'despesa')),
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pendente', 'concluido', 'cancelado'));
