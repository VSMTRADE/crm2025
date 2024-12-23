-- Fazer backup dos dados existentes
CREATE TABLE IF NOT EXISTS transactions_backup AS SELECT * FROM transactions;

-- Remover a tabela existente
DROP TABLE IF EXISTS transactions;

-- Recriar a tabela com a estrutura correta
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Adicionar as constraints
ALTER TABLE transactions 
ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('receita', 'despesa'));

ALTER TABLE transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pendente', 'concluido', 'cancelado'));

-- Restaurar os dados do backup (se existirem)
INSERT INTO transactions (
    id, title, amount, type, date, category, 
    description, status, created_at
)
SELECT 
    id, 
    title, 
    amount, 
    CASE 
        WHEN type = 'income' THEN 'receita'
        WHEN type = 'expense' THEN 'despesa'
        ELSE type 
    END as type,
    date, 
    category, 
    description,
    CASE 
        WHEN status = 'pending' THEN 'pendente'
        WHEN status = 'completed' THEN 'concluido'
        WHEN status = 'cancelled' THEN 'cancelado'
        ELSE status 
    END as status,
    created_at
FROM transactions_backup
WHERE id IS NOT NULL;

-- Criar índices para melhor performance
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Adicionar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
