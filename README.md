
---

### 📁 Projeto: [Back-End_Sistema-de-Gerenciamento-Financeiro-SISGEF](https://github.com/duhsoares21/Back-End_Sistema-de-Gerenciamento-Financeiro-SISGEF)

```markdown
# 🧮 SISGEF - Sistema de Gerenciamento Financeiro (Back-End)

API RESTful desenvolvida com Node.js e Fastify para gerenciamento de finanças pessoais. Utiliza PostgreSQL como banco de dados relacional.

## 🛠️ Tecnologias Utilizadas

- Node.js
- Fastify
- PostgreSQL
- pg (biblioteca para conexão com PostgreSQL)
- TypeScript

## 📦 Funcionalidades

- Endpoints para criação, leitura, atualização e exclusão de transações financeiras
- Integração com banco de dados PostgreSQL
- Estrutura modular para fácil manutenção e escalabilidade

## ⚙️ Configuração
```
```bash

# 1. Clone o repositório:
git clone https://github.com/duhsoares21/Back-End_Sistema-de-Gerenciamento-Financeiro-SISGEF.git

# 2. Navegue até o diretório do projeto:
cd Back-End_Sistema-de-Gerenciamento-Financeiro-SISGEF

# 3. Instale as dependências:
npm install

# 4. Configure as variáveis de ambiente:
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/sisgef
//Substitua usuario, senha e sisgef conforme sua configuração local do PostgreSQL.

# 5. Inicie o servidor:
node src/server.ts
```
O servidor vai executar em http://localhost na porta determinada no arquivo .env
