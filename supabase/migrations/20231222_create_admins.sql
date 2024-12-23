-- Criar tabela de administradores
CREATE TABLE public.admins (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    active BOOLEAN DEFAULT true
);

-- Habilitar RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Admins podem ver todos os administradores"
    ON public.admins FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

CREATE POLICY "Admins podem criar outros administradores"
    ON public.admins FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

CREATE POLICY "Admins podem atualizar outros administradores"
    ON public.admins FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- Inserir o primeiro administrador
INSERT INTO public.admins (id, email, name)
SELECT id, email, 'Administrador Principal'
FROM auth.users
WHERE email = 'wanderson.martins.silva@gmail.com'
ON CONFLICT (id) DO NOTHING;
