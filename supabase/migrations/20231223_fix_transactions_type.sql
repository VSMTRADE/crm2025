-- Remover a constraint existente
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

-- Converter valores existentes para português
UPDATE transactions 
SET type = CASE 
    WHEN type = 'income' THEN 'receita'
    WHEN type = 'expense' THEN 'despesa'
    ELSE type 
END;

-- Adicionar a constraint com valores em português
ALTER TABLE transactions 
ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('receita', 'despesa'));
