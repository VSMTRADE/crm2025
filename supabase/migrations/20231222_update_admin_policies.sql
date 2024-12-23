-- Remover políticas antigas
DROP POLICY IF EXISTS "Admins podem ver todos os administradores" ON public.admins;
DROP POLICY IF EXISTS "Admins podem criar outros administradores" ON public.admins;
DROP POLICY IF EXISTS "Admins podem atualizar outros administradores" ON public.admins;

-- Criar novas políticas
CREATE POLICY "Admins podem ver todos os administradores"
    ON public.admins FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
    ));

CREATE POLICY "Admins podem criar outros administradores"
    ON public.admins FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
    ));

CREATE POLICY "Admins podem atualizar outros administradores"
    ON public.admins FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
    ));
