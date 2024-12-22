-- Criar enum para roles de usuário
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Criar índice para busca por email
CREATE INDEX idx_users_email ON users(email);

-- Criar política de segurança RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para admins
CREATE POLICY admin_all ON users
    FOR ALL
    TO authenticated
    USING (role = 'admin');

-- Inserir usuário admin padrão (senha: Admin@2025)
INSERT INTO users (email, password_hash, role, name) 
VALUES (
    'admin@crm.com',
    '$2a$10$X7RYFYzV8jKJ.qTq5JVkEOk/mI.JQ7JyW3TPP/qoOHKFZ.pkX4vFi',
    'admin',
    'Administrador'
) ON CONFLICT (email) DO NOTHING;
