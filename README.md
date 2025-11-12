# 02-api-rest-nodejs

Projeto de aprendizado feito durante a trilha da Rocketseat. É uma API REST simples com Fastify, Knex e SQLite (ou outro banco via Knex) para gerenciar transações financeiras (criação, listagem, resumo e busca por id).

## Tecnologias

- Node.js + TypeScript
- Fastify
- Knex (migrations)
- Supertest + Vitest (testes)
- Prettier (formatação)

## Estrutura principal

- `src/`
  - `app.ts` - instancia e registra plugins/rotas
  - `server.ts` - inicia o servidor (apenas para execução)
  - `routes/transactions.ts` - rotas relacionadas a transações
  - `database.ts` - configuração do Knex
  - `middlewares/check-session-id-exists.ts` - middleware para validar cookie `sessionId`
  - `@types/knex.d.ts` - declarações de tipos para tabelas do Knex
- `db/migrations/` - migrations do banco
- `test/` - testes automatizados

## Requisitos

- Node 18+ recomendado
- npm ou yarn

## Instalação (Windows - PowerShell)

Abra um terminal na raiz do projeto (`d:\Codigos\rocketseat\node\projeto2`) e rode:

```powershell
# instalar dependências
npm install
# ou
# yarn
```

## Variáveis de ambiente

As configurações de porta e demais variáveis ficam em `src/env/index.ts`. Se quiser mudar a porta, atualize lá ou defina a variável `PORT` no ambiente.

## Banco de dados e migrations

O projeto usa Knex com migrations. Para criar o banco e aplicar migrations rode:

```powershell
# executar migrations
npx knex --knexfile knexfile.ts migrate:latest
```

(Se usar `npm` scripts, pode existir um script no `package.json` para isso — verifique `package.json`.)

## Rodando a aplicação

Para rodar em modo de desenvolvimento:

```powershell
npm run dev
# ou
# yarn dev
```

Para buildar/rodar produção (se houver scripts configurados):

```powershell
npm run build
npm start
```

## Testes

Os testes usam Vitest + Supertest. Para rodar a suíte de testes:

```powershell
npm test
# ou
# npx vitest
```

Notas importantes para testes:

- Use `request(app.server)` no Supertest para apontar para a instância internal do Fastify (evita `listen` em porta real).
- Garanta que o app esteja pronto antes de enviar requisições nos testes: chame `await app.ready()` no `beforeAll`.
- Feche o app ao final dos testes com `await app.close()` em `afterAll` para evitar timeouts ou processos pendurados.

Exemplo mínimo de `test/example.spec.ts`:

```ts
import request from 'supertest'
import { beforeAll, afterAll, test } from 'vitest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('o usuário consegue criar uma nova transação', async () => {
  await request(app.server)
    .post('/transactions')
    .send({ title: 'New Transaction', amount: 5000, type: 'credit' })
    .expect(201)
})
```

## Notas sobre formatação e imports "sumindo"

- Prettier apenas formata — ele não remove imports não utilizados. Remoção de imports é feita por linters ou por ferramentas do editor (ex.: organize imports do TypeScript/VS Code) ou por ESLint com regras de "no-unused-vars".
- Se um arquivo tipo `src/@types/knex.d.ts` tem um `import { Knex } from 'knex'` que "some" ao salvar, verifique:
  - Se há alguma extensão do editor (como "Organize Imports") ativa que remove imports não usados.
  - Se você quer que o arquivo seja ignorado pelo Prettier, crie `.prettierignore` na raiz e adicione `src/@types/knex.d.ts`.
  - Para evitar que linters removam, adicione um comentário `/* eslint-disable-next-line @typescript-eslint/no-unused-vars */` antes do import (se estiver usando ESLint).

## Dicas de debug comuns

- Problema: apenas a rota `POST /transactions` funciona e as outras retornam sem resposta ou behaving unexpectedly.

  - Causa comum: ordem das rotas. Rotas dinâmicas como `/:id` devem vir depois de rotas estáticas como `/summary` para evitar conflitos.
  - Verifique middlewares que podem bloquear respostas, e se o `sessionId` esperado está sendo enviado nos cookies.

- Problema: timeouts nos testes
  - Garanta `await app.ready()` antes das requisições e `await app.close()` depois.
  - Use `request(app.server)` para Supertest ou `app.inject()` para testes com Fastify puro.

## Scripts (exemplos)

Verifique o `package.json` para scripts existentes. Exemplos úteis para adicionar se não existirem:

```json
{
  "scripts": {
    "dev": "ts-node-dev src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "knex --knexfile knexfile.ts migrate:latest",
    "test": "vitest"
  }
}
```

## Próximos passos / sugestões de melhorias

- Adicionar testes mais completos (listagem, busca por id, summary).
- Configurar um banco de testes isolado e limpar dados entre testes (beforeEach/afterEach).
- Adicionar documentação das rotas (ex.: Swagger).

---

Se quiser, eu atualizo ou personalizo o README com comandos reais do seu `package.json` e deixo exemplos de uso das rotas (curl / Insomnia). Quer que eu faça isso agora?
