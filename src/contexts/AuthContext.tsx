import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export type User = {
  id: string;
  email: string;
  isAdmin: boolean;
  displayName?: string;  // Novo campo para exibição
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuração segura do admin
const ADMIN_EMAILS = [
  'wanderson.martins.silva@gmail.com',
  'vanessatorresfiel@gmail.com'
];

const ADMIN_CONFIG = {
  displayName: 'Administrador'  // Nome para exibição
};

// Função para verificar admin de forma segura
const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.some(adminEmail => 
    email.toLowerCase() === adminEmail.toLowerCase()
  );
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const isAdmin = isAdminEmail(session.user.email!);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          isAdmin,
          displayName: isAdmin ? ADMIN_CONFIG.displayName : session.user.email
        });
      }
      setLoading(false);
    });

    // Escutar mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const isAdmin = isAdminEmail(session.user.email!);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          isAdmin,
          displayName: isAdmin ? ADMIN_CONFIG.displayName : session.user.email
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Verificando email:', email);
      // Verificar se é o admin
      if (!isAdminEmail(email)) {
        console.log('Email não é do admin');
        throw new Error('Acesso permitido apenas para administradores');
      }

      console.log('Tentando login no Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('Erro no login:', error);
        throw error;
      }

      if (data.user) {
        console.log('Usuário logado:', data.user);
        if (!isAdminEmail(data.user.email)) {
          console.log('Email não corresponde ao admin');
          await signOut();
          throw new Error('Acesso permitido apenas para administradores');
        }
        console.log('Login bem sucedido, redirecionando...');
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
