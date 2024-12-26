import fetch from 'node-fetch';

// Substitua estas variáveis pelos valores do seu projeto Supabase
const SUPABASE_URL = 'https://yfqvfvwbsxjvkrumzwlc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmcXZmdndic3hqdmtydW16d2xjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMzE4OTU4MCwiZXhwIjoyMDE4NzY1NTgwfQ.qzF9RHu0R9HNDT-24TGxL_PZxVwRcvdUVR9BHDtLKAg';

async function createUser() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/auth/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({
        email: 'vanessatorresfiel@gmail.com',
        password: 'Va250385@',
        email_confirm: true
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Erro ao criar usuário:', data.error);
      return;
    }

    console.log('Usuário criado com sucesso:', data);
  } catch (err) {
    console.error('Erro:', err);
  }
}

createUser();
