import { useState, useRef } from 'react';
import { backupService } from '../services/backupService';
import { Download, Loader2, RefreshCw, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Backup() {
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(
    localStorage.getItem('lastBackup')
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    try {
      setLoading(true);
      const data = await backupService.exportData();
      backupService.downloadBackup(data);
      
      // Salvar timestamp do último backup
      const now = new Date().toLocaleString();
      localStorage.setItem('lastBackup', now);
      setLastBackup(now);
      
      toast.success('Backup realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer backup:', error);
      toast.error('Erro ao fazer backup: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);

      // Ler o arquivo
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const backupData = JSON.parse(content);

          // Confirmar importação
          if (window.confirm(
            'ATENÇÃO: A importação irá substituir todos os dados existentes. ' +
            'Tem certeza que deseja continuar? ' +
            'Recomendamos fazer um backup dos dados atuais antes de prosseguir.'
          )) {
            await backupService.importBackup(backupData);
            toast.success('Backup importado com sucesso!');
          }
        } catch (error) {
          console.error('Erro ao importar backup:', error);
          toast.error('Erro ao importar backup: ' + (error as Error).message);
        } finally {
          setImporting(false);
          // Limpar input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      toast.error('Erro ao ler arquivo: ' + (error as Error).message);
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Backup do Sistema</h2>
          {lastBackup && (
            <div className="flex items-center text-sm text-gray-500">
              <RefreshCw className="w-4 h-4 mr-2" />
              Último backup: {lastBackup}
            </div>
          )}
        </div>

        <div className="prose max-w-none mb-6">
          <p>
            O backup irá exportar todos os dados do sistema em um arquivo JSON, incluindo:
          </p>
          <ul>
            <li>Contatos</li>
            <li>Tarefas</li>
            <li>Transações</li>
          </ul>
          <p>
            Recomendamos fazer backup regularmente para garantir a segurança dos seus dados.
            O arquivo de backup pode ser usado para restaurar os dados em caso de necessidade.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackup}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exportando dados...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Fazer Backup Agora
              </>
            )}
          </button>

          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando dados...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Backup
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Atenção ao importar</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                A importação de backup irá substituir todos os dados existentes no sistema.
                Certifique-se de fazer um backup dos dados atuais antes de importar um novo backup.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Backup Automático no Supabase
        </h3>
        <div className="prose max-w-none">
          <p>
            Além do backup manual, o Supabase mantém backups automáticos do banco de dados:
          </p>
          <ul>
            <li>Backup diário dos últimos 7 dias</li>
            <li>Backup semanal dos últimos 30 dias</li>
            <li>Point-in-time recovery (PITR) para restaurar dados de qualquer momento</li>
          </ul>
          <p>
            Para restaurar um backup ou acessar versões anteriores dos dados, acesse o{' '}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Supabase Dashboard
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
