-- Backup dos dados existentes
CREATE TABLE IF NOT EXISTS transactions_backup AS 
SELECT * FROM transactions;

-- Remover a tabela existente
DROP TABLE IF EXISTS transactions;

-- Recriar a tabela com a estrutura correta
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    user_id UUID REFERENCES auth.users(id)
);

-- Adicionar as constraints
ALTER TABLE transactions
ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('income', 'expense'));

ALTER TABLE transactions
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled'));

-- Restaurar dados do backup
INSERT INTO transactions (
    id, created_at, title, description, amount, 
    type, date, category, status, user_id
)
SELECT 
    id, created_at, title, description, amount, 
    type, date, category, 
    CASE 
        WHEN status IS NULL OR status NOT IN ('pending', 'completed', 'cancelled') 
        THEN 'completed' 
        ELSE status 
    END,
    user_id
FROM transactions_backup;

-- Remover tabela de backup
DROP TABLE transactions_backup;
