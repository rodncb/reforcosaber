# Configurando CORS no Supabase para GitHub Pages

Para que sua aplicação no GitHub Pages funcione corretamente com o Supabase, é necessário configurar as permissões de CORS (Cross-Origin Resource Sharing) no painel de administração do Supabase.

## Passos para configurar:

1. Acesse o [Dashboard do Supabase](https://app.supabase.io) e faça login
2. Selecione seu projeto
3. No menu lateral, vá para **Authentication** > **URL Configuration**
4. Na seção **Site URL**, adicione a URL do seu site no GitHub Pages:
   ```
   https://rodncb.github.io/reforcosaber
   ```
5. Na seção **Redirect URLs**, adicione as seguintes URLs:
   ```
   https://rodncb.github.io/reforcosaber/
   https://rodncb.github.io/reforcosaber/login
   https://rodncb.github.io/reforcosaber/callback
   ```
6. Clique em **Save**

## Configuração adicional de CORS

Para projetos que requerem configuração CORS adicional:

1. No menu lateral, vá para **Project Settings** > **API**
2. Na seção **CORS (Cross-Origin Resource Sharing)**, adicione:
   ```
   https://rodncb.github.io
   https://rodncb.github.io/reforcosaber
   http://localhost:5176
   ```
3. Verifique a opção **Enable for all routes including Storage**
4. Clique em **Save**

Depois de fazer essas alterações, pode levar alguns minutos para que as configurações de CORS sejam propagadas. Teste novamente a autenticação no GitHub Pages depois disso.
