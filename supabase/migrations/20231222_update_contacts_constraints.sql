-- Primeiro, remover as constraints existentes
ALTER TABLE contacts
DROP CONSTRAINT IF EXISTS contacts_type_check,
DROP CONSTRAINT IF EXISTS contacts_status_check;

-- Adicionar as novas constraints
ALTER TABLE contacts
ADD CONSTRAINT contacts_type_check 
CHECK (type IN ('cliente', 'parceiro', 'lead')),
ADD CONSTRAINT contacts_status_check 
CHECK (status IN ('ativo', 'inativo'));

-- Atualizar os registros existentes
UPDATE contacts 
SET type = 
  CASE 
    WHEN type = 'client' THEN 'cliente'
    WHEN type = 'partner' THEN 'parceiro'
    ELSE type
  END,
status = 
  CASE 
    WHEN status = 'active' THEN 'ativo'
    WHEN status = 'inactive' THEN 'inativo'
    ELSE 'ativo'
  END;
