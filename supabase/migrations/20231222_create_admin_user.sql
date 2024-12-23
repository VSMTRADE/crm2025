-- Habilitar a extensão pgcrypto se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para criar usuário admin
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
    admin_id UUID;
BEGIN
    -- Primeiro, inserir na auth.users
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
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@crm.com',
        crypt('Admin@2025', gen_salt('bf')),
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
    RETURNING id INTO admin_id;

    -- Depois, inserir na tabela users
    INSERT INTO users (
        id,
        email,
        password_hash,
        role,
        name,
        created_at,
        last_login
    )
    VALUES (
        admin_id,
        'admin@crm.com',
        crypt('Admin@2025', gen_salt('bf')),
        'admin',
        'Administrador',
        NOW(),
        NOW()
    );

    -- Inserir na auth.identities
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
    VALUES (
        gen_random_uuid(),
        admin_id,
        format('{"sub":"%s","email":"%s"}', admin_id::text, 'admin@crm.com')::jsonb,
        'email',
        NOW(),
        NOW(),
        NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Executar a função
SELECT create_admin_user();
