-- Primeiro, remova políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Permite inserção a usuários autenticados" ON aulas;
DROP POLICY IF EXISTS "Permite leitura a usuários autenticados" ON aulas;
DROP POLICY IF EXISTS "Permite atualização a usuários autenticados" ON aulas;
DROP POLICY IF EXISTS "Permite exclusão a usuários autenticados" ON aulas;
DROP POLICY IF EXISTS "Permite inserção a usuários anônimos (para testes)" ON aulas;
DROP POLICY IF EXISTS "Permite leitura a usuários anônimos (para testes)" ON aulas;
DROP POLICY IF EXISTS "Permite atualização a usuários anônimos (para testes)" ON aulas;
DROP POLICY IF EXISTS "Permite exclusão a usuários anônimos (para testes)" ON aulas;

-- Habilita o RLS na tabela aulas (se ainda não estiver habilitado)
ALTER TABLE aulas ENABLE ROW LEVEL SECURITY;

-- Cria uma política que permite inserir dados para qualquer usuário autenticado
CREATE POLICY "Permite inserção a usuários autenticados" 
ON aulas
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Cria uma política que permite selecionar/ler dados para qualquer usuário autenticado
CREATE POLICY "Permite leitura a usuários autenticados"
ON aulas
FOR SELECT
TO authenticated
USING (true);

-- Cria uma política que permite atualizar dados para qualquer usuário autenticado
CREATE POLICY "Permite atualização a usuários autenticados"
ON aulas
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Cria uma política que permite deletar dados para qualquer usuário autenticado
CREATE POLICY "Permite exclusão a usuários autenticados"
ON aulas
FOR DELETE
TO authenticated
USING (true);

-- Para ambiente de desenvolvimento, criamos políticas para acesso anônimo
CREATE POLICY "Permite inserção a usuários anônimos (para testes)"
ON aulas
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Permite leitura a usuários anônimos (para testes)"
ON aulas
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Permite atualização a usuários anônimos (para testes)"
ON aulas
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Permite exclusão a usuários anônimos (para testes)"
ON aulas
FOR DELETE
TO anon
USING (true); 