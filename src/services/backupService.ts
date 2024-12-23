import { supabase } from '../lib/supabase';

interface BackupData {
  contacts: any[];
  tasks: any[];
  transactions: any[];
}

interface BackupFile {
  version: string;
  timestamp: string;
  data: BackupData;
}

export const backupService = {
  async exportData(): Promise<BackupData> {
    try {
      // Buscar dados de todas as tabelas
      const [
        { data: contacts, error: contactsError },
        { data: tasks, error: tasksError },
        { data: transactions, error: transactionsError }
      ] = await Promise.all([
        supabase.from('contacts').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('transactions').select('*')
      ]);

      if (contactsError) throw contactsError;
      if (tasksError) throw tasksError;
      if (transactionsError) throw transactionsError;

      const backupData: BackupData = {
        contacts: contacts || [],
        tasks: tasks || [],
        transactions: transactions || []
      };

      return backupData;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  },

  downloadBackup(data: BackupData) {
    try {
      // Criar o objeto de backup com metadados
      const backup: BackupFile = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data
      };

      // Converter para JSON e criar blob
      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Criar URL e link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Configurar o nome do arquivo com data atual
      const date = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `crm_backup_${date}.json`;
      
      // Trigger o download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download do backup:', error);
      throw error;
    }
  },

  validateBackupFile(file: BackupFile): boolean {
    // Verificar versão do backup
    if (file.version !== '1.0') {
      throw new Error('Versão do backup não suportada');
    }

    // Verificar se todas as tabelas necessárias existem
    const requiredTables = ['contacts', 'tasks', 'transactions'];
    for (const table of requiredTables) {
      if (!file.data[table as keyof BackupData]) {
        throw new Error(`Tabela ${table} não encontrada no backup`);
      }
    }

    return true;
  },

  async importBackup(file: BackupFile): Promise<void> {
    try {
      // Validar arquivo de backup
      this.validateBackupFile(file);

      // Importar cada tabela em sequência
      const tables: (keyof BackupData)[] = ['contacts', 'tasks', 'transactions'];
      
      for (const table of tables) {
        // Primeiro, limpar a tabela existente
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Não deletar registros especiais se houver

        if (deleteError) throw new Error(`Erro ao limpar tabela ${table}: ${deleteError.message}`);

        // Se houver dados para importar
        if (file.data[table] && file.data[table].length > 0) {
          // Inserir novos dados
          const { error: insertError } = await supabase
            .from(table)
            .insert(file.data[table]);

          if (insertError) throw new Error(`Erro ao importar ${table}: ${insertError.message}`);
        }
      }
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      throw error;
    }
  }
};
