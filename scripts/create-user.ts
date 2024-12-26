import { createClient } from '@supabase/supabase-js';

// Substitua estas variáveis pelos valores corretos do seu projeto Supabase
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE';
const SUPABASE_SERVICE_KEY = 'SUA_SERVICE_KEY_DO_SUPABASE'; // Use a service key, não a anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'vanessatorresfiel@gmail.com',
    password: 'Va250385@',
    email_confirm: true
  });

  if (error) {
    console.error('Erro ao criar usuário:', error.message);
    return;
  }

  console.log('Usuário criado com sucesso:', data);
}

createUser();
