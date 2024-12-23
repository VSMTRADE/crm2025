-- Atualizar os metadados do usuário principal para incluir isAdmin = true
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{isAdmin}',
    'true'
)
WHERE email = 'wanderson.martins.silva@gmail.com';

-- Garantir que o usuário está na tabela de admins
INSERT INTO public.admins (id, email, name)
SELECT id, email, 'Wanderson Martins'
FROM auth.users
WHERE email = 'wanderson.martins.silva@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET name = 'Wanderson Martins', active = true;
