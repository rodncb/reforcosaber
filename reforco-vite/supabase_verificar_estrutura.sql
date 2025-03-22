-- Cria uma função para verificar a estrutura de uma tabela
CREATE OR REPLACE FUNCTION verificar_estrutura_tabela(nome_tabela text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Obter informações sobre as colunas da tabela
    WITH colunas AS (
        SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM 
            information_schema.columns
        WHERE 
            table_schema = 'public' AND 
            table_name = nome_tabela
    ),
    chaves AS (
        SELECT
            tc.constraint_name,
            kcu.column_name,
            tc.constraint_type
        FROM
            information_schema.table_constraints tc
        JOIN
            information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE
            tc.table_schema = 'public' AND
            tc.table_name = nome_tabela AND
            tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
    ),
    referencias AS (
        SELECT
            kcu.column_name,
            ccu.table_name AS referenced_table,
            ccu.column_name AS referenced_column
        FROM
            information_schema.constraint_column_usage ccu
        JOIN
            information_schema.referential_constraints rc
            ON ccu.constraint_name = rc.unique_constraint_name
        JOIN
            information_schema.key_column_usage kcu
            ON kcu.constraint_name = rc.constraint_name
        WHERE
            kcu.table_schema = 'public' AND
            kcu.table_name = nome_tabela
    )
    SELECT 
        jsonb_build_object(
            'tabela', nome_tabela,
            'colunas', jsonb_agg(
                jsonb_build_object(
                    'nome', c.column_name,
                    'tipo', c.data_type,
                    'nullable', c.is_nullable,
                    'valor_padrao', c.column_default,
                    'chave', COALESCE(k.constraint_type, ''),
                    'referencia', CASE 
                                    WHEN r.referenced_table IS NOT NULL THEN
                                        jsonb_build_object(
                                            'tabela', r.referenced_table,
                                            'coluna', r.referenced_column
                                        )
                                    ELSE NULL
                                END
                )
            )
        )
    INTO
        result
    FROM
        colunas c
    LEFT JOIN
        chaves k ON c.column_name = k.column_name
    LEFT JOIN
        referencias r ON c.column_name = r.column_name;

    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'erro', SQLERRM,
            'codigo', SQLSTATE
        );
END;
$$; 