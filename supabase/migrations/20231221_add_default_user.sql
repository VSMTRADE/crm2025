-- Insert a default user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'default@example.com',
  '',
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}'
) ON CONFLICT (id) DO NOTHING;

-- Insert corresponding user profile
INSERT INTO public.users (
  id,
  full_name,
  role,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Default User',
  'user',
  now()
) ON CONFLICT (id) DO NOTHING;
