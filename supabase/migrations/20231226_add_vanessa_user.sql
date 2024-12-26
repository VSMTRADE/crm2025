-- Inserir usuário Vanessa no auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'vanessatorresfiel@gmail.com',
    crypt('Va250385@', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
)
ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('Va250385@', gen_salt('bf')),
    updated_at = NOW(),
    last_sign_in_at = NOW();

-- Garantir que o usuário tenha a role correta
UPDATE auth.users 
SET role = 'authenticated' 
WHERE email = 'vanessatorresfiel@gmail.com';
