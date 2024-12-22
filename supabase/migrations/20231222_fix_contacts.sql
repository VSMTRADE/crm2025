-- Atualiza os tipos de contato
UPDATE contacts 
SET type = 'cliente' 
WHERE type = 'client';

UPDATE contacts 
SET type = 'parceiro' 
WHERE type = 'partner';

-- Define todos os contatos como ativos por padrão
UPDATE contacts 
SET status = 'ativo' 
WHERE status IS NULL OR status = 'active';

UPDATE contacts 
SET status = 'inativo' 
WHERE status = 'inactive';
