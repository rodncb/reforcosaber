# Reforço do Saber - Sistema de Gestão

Sistema de gestão para o reforço escolar "Reforço do Saber", focado no gerenciamento de alunos, aulas e calendário.

## Estrutura do Projeto

O repositório contém dois projetos principais:

- **reforco-vite**: Versão atual do projeto utilizando Vite, React e Supabase
- **reforco-do-saber**: Versão anterior do projeto (legado)

## Tecnologias Utilizadas

- **Frontend**: React.js, TailwindCSS
- **Backend**: Supabase (Banco de dados PostgreSQL)
- **Build**: Vite

## Instalação e Execução

Para executar o projeto atual:

```bash
# Navegue para o diretório do projeto Vite
cd reforco-vite

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env com base no .env.example

# Execute o projeto em modo de desenvolvimento
npm run dev
```

## Estrutura do Banco de Dados (Supabase)

### Tabela: alunos

- id (uuid, primary key)
- nome (text, not null)
- email (text)
- telefone (text)
- endereco (text)
- materia (text)
- observacoes (text)
- created_at (timestamp with time zone, default: now())

### Tabela: aulas

- id (uuid, primary key)
- aluno_id (uuid, foreign key referenciando alunos.id)
- data_aula (date, not null)
- horario (text, not null)
- duracao (integer, default: 60) - em minutos
- materia (text)
- conteudo (text)
- status (text, default: 'pendente') - valores: pendente, concluida, cancelada
- observacoes (text)
- created_at (timestamp with time zone, default: now())

### Tabela: usuarios

- id (uuid, primary key)
- nome (text, not null)
- email (text)
- role (text, default: 'professor')
- created_at (timestamp with time zone, default: now())

## Funcionalidades

- [x] Dashboard com estatísticas gerais
- [x] Autenticação de usuários
- [x] Gerenciamento de alunos
- [x] Gerenciamento de aulas
- [ ] Calendário visual de aulas
- [ ] Relatórios de desempenho

## Contato

Desenvolvido para o Reforço do Saber.
