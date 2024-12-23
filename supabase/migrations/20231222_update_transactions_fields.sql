-- Atualizar a estrutura da tabela transactions
DO $$ 
BEGIN 
    -- Adicionar coluna title se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'transactions' AND column_name = 'title') THEN
        ALTER TABLE transactions ADD COLUMN title VARCHAR(255);
    END IF;

    -- Copiar dados de description para title
    UPDATE transactions SET title = description WHERE title IS NULL;

    -- Tornar title NOT NULL
    ALTER TABLE transactions ALTER COLUMN title SET NOT NULL;

    -- Remover coluna description
    ALTER TABLE transactions DROP COLUMN IF EXISTS description;
END $$;
