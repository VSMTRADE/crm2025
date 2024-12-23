-- Habilitar RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Users can view own data" ON auth.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON auth.users
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view own refresh tokens" ON auth.refresh_tokens
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own refresh tokens" ON auth.refresh_tokens
    FOR DELETE
    USING (auth.uid() = user_id);
