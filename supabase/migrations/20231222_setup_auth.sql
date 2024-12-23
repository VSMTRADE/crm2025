-- Habilitar a extensão de UUID se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar schema auth se não existir
CREATE SCHEMA IF NOT EXISTS auth;

-- Criar tabela de usuários se não existir
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    email character varying NOT NULL UNIQUE,
    encrypted_password character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb DEFAULT '{}'::jsonb,
    raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
    is_super_admin boolean DEFAULT false,
    confirmed_at timestamp with time zone,
    confirmation_token character varying,
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying,
    recovery_sent_at timestamp with time zone,
    email_change_token character varying,
    email_change character varying,
    email_change_sent_at timestamp with time zone,
    instance_id uuid
);

-- Criar índices necessários
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users (email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users (instance_id);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION auth.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_auth_users_updated_at ON auth.users;
CREATE TRIGGER update_auth_users_updated_at
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.update_updated_at_column();

-- Criar tabela de refresh tokens
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    token character varying NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    parent character varying,
    revoked boolean DEFAULT false
);

-- Criar índices para refresh tokens
CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON auth.refresh_tokens (token);
CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx ON auth.refresh_tokens (user_id);

-- Criar trigger para atualizar updated_at em refresh_tokens
DROP TRIGGER IF EXISTS update_auth_refresh_tokens_updated_at ON auth.refresh_tokens;
CREATE TRIGGER update_auth_refresh_tokens_updated_at
    BEFORE UPDATE ON auth.refresh_tokens
    FOR EACH ROW
    EXECUTE FUNCTION auth.update_updated_at_column();

-- Inserir usuário admin padrão
INSERT INTO auth.users (
    email,
    encrypted_password,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
) VALUES (
    'admin@crm.com',
    crypt('Admin@2025', gen_salt('bf')),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"name": "Administrador"}'::jsonb,
    true
) ON CONFLICT (email) DO NOTHING;
