### Sumário
- [Sobre o Projeto](#sobre-o-projeto)
- [Conceitos DDD Aplicados](#conceitos-ddd-aplicados)
- [Como Executar](#como-executar)
- [Executar Testes](#executar-testes)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

- [Project Overview](#project-overview)
- [Applied DDD Concepts](#applied-ddd-concepts)
- [How to Run](#how-to-run)
- [Run Tests](#run-tests)
- [Project Structure](#project-structure)

# Versão em Português

## Sobre o Projeto

Este é um fórum desenvolvido com **Node.js** e **NestJS**, seguindo os princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**. O objetivo é criar uma aplicação escalável, testável e de fácil manutenção, separando claramente as responsabilidades e promovendo boas práticas de engenharia de software.

## Conceitos DDD Aplicados

- **Entidades**: Objetos com identidade única (ex: Pergunta, Resposta, Comentário)
- **Value Objects**: Objetos de valor sem identidade (ex: Slug)
- **Repositórios**: Abstraem acesso a dados
- **Casos de Uso**: Lógica de negócio central (ex: criar, editar, buscar perguntas/respostas)
- **Agregados**: Agrupam entidades relacionadas
- **Eventos de Domínio**: Reações a mudanças importantes (ex: notificação ao criar resposta)

## Como Executar

1. Instale as dependências:
  ```bash
  pnpm install
  ```
2. Clone o arquivo `.env.example` e renomeie para `.env`
3. Execute as migrations:
  ```bash
  pnpm prisma migrate dev
  ```
4. Inicie o servidor:
  ```bash
  pnpm start
  pnpm start:dev
  ```

## Executar Testes

Os testes Unitários (Unit)
  ```bash
  pnpm test
  ```
Os teste de Integração (E2E)
  ```bash
  pnpm test:watch
  ```

## Estrutura do Projeto

- `src/`: Código principal do projeto.
- `core/`: Tipos base, utilitários, eventos de domínio e erros compartilhados.
- `domain/`: Subdomínios como `forum` e `notification`, organizados em camadas de aplicação e entidades.
- `infra/`: Código externo da aplicação, framework, autenticação, banco de dados e ORM.
- `test/`: Repositórios em memória, fábricas e utilitários para testes automatizados.

```
├── 📁 prisma/
│   ├── 📁 migrations/
│   └── 📄 schema.prisma
├── 📁 src/
│   ├── 📁 core/
│   │   ├── 📁 entities/
│   │   │   ├── 📄 aggregate-root.ts
│   │   │   ├── 📄 entity.ts
│   │   │   ├── 📄 unique-entity-id.ts
│   │   │   ├── 📄 watched-list.spec.ts
│   │   │   └── 📄 watched-list.ts
│   │   ├── 📁 errors/
│   │   │   ├── 📁 errors/
│   │   │   │   ├── 📄 not-allowed-error.ts
│   │   │   │   └── 📄 resource-not-found-error.ts
│   │   │   └── 📄 use-case-error.ts
│   │   ├── 📁 events/
│   │   │   ├── 📄 domain-event.ts
│   │   │   ├── 📄 domain-events.spec.ts
│   │   │   ├── 📄 domain-events.ts
│   │   │   └── 📄 event-handler.ts
│   │   ├── 📁 repositories/
│   │   │   └── 📄 pagination-params.ts
│   │   ├── 📁 types/
│   │   │   └── 📄 optional.ts
│   │   ├── 📄 either.spec.ts
│   │   └── 📄 either.ts
│   ├── 📁 domain/
│   │   ├── 📁 forum/
│   │   │   ├── 📁 application/
│   │   │   │   ├── 📁 cryptography/
│   │   │   │   │   ├── 📄 encrypter.ts
│   │   │   │   │   ├── 📄 hash-comparer.ts
│   │   │   │   │   └── 📄 hash-generator.ts
│   │   │   │   ├── 📁 repositories/
│   │   │   │   │   ├── 📄 answer-attachments-repository.ts
│   │   │   │   └── 📁 use-cases/
│   │   │   │       ├── 📁 errors/
│   │   │   │       │   └── 📄 wrong-credentials-error.ts
│   │   │   │       └── 📄 register-student.ts
│   │   │   └── 📁 enterprise/
│   │   │       ├── 📁 entities/
│   │   │       │   ├── 📁 value-objects/
│   │   │       │   │   ├── 📄 slug.test.ts
│   │   │       │   │   └── 📄 slug.ts
│   │   │       │   └── 📄 student.ts
│   │   │       └── 📁 events/
│   │   │           └── 📄 question-best-answer-chosen-event.ts
│   │   └── 📁 notification/
│   │       ├── 📁 application/
│   │       │   ├── 📁 repositories/
│   │       │   │   └── 📄 notifications-repository.ts
│   │       │   ├── 📁 subscribers/
│   │       │   │   ├── 📄 on-question-best-answer-chosen.spec.ts
│   │       │   │   └── 📄 on-question-best-answer-chosen.ts
│   │       │   └── 📁 use-case/
│   │       │       ├── 📄 send-notification.spec.ts
│   │       │       └── 📄 send-notification.ts
│   │       └── 📁 enterprise/
│   │           └── 📁 entities/
│   │               └── 📄 notification.ts
│   └── 📁 infra/
│       ├── 📁 auth/
│       │   ├── 📄 auth.module.ts
│       │   ├── 📄 current-user-decorator.ts
│       │   ├── 📄 jwt-auth-guard.ts
│       │   ├── 📄 jwt.strategy.ts
│       │   └── 📄 public.ts
│       ├── 📁 cryptography/
│       │   ├── 📄 bcrypt-hasher.ts
│       │   ├── 📄 cryptography.module.ts
│       │   └── 📄 jwt-encrypter.ts
│       ├── 📁 database/ 🚫 (auto-hidden)
│       ├── 📁 env/ 🚫 (auto-hidden)
│       ├── 📁 http/
│       │   ├── 📁 controllers/
│       │   │   ├── 📄 fetch-recent-questions.controller.e2e-spec.ts
│       │   │   └── 📄 fetch-recent-questions.controller.ts
│       │   ├── 📁 pipes/
│       │   │   └── 📄 zod-validation-pipe.ts
│       │   ├── 📁 presenters/
│       │   │   └── 📄 question-presenter.ts
│       │   └── 📄 http.module.ts
│       ├── 📄 app.module.ts
│       └── 📄 main.ts
├── 📁 test/
│   ├── 📁 cryptography/
│   │   ├── 📄 fake-encrypter.ts
│   │   └── 📄 fake-hasher.ts
│   ├── 📁 factories/
│   │   └── 📄 make-student.ts
│   ├── 📁 repositories/
│   │   └── 📄 in-memory-students-repository.ts
│   ├── 📁 utils/
│   │   └── 📄 wait-for.ts
│   └── 📄 setup-e2e.ts
├── ⚙️ docker-compose.yml
├── 📄 eslint.config.mjs
├── 📄 nest-cli.json
├── 📄 package.json
├── ⚙️ pnpm-lock.yaml
├── 📖 readme.md
├── 📄 tsconfig.json
├── 📄 vitest.config.e2e.ts
└── 📄 vitest.config.ts
```

---

# English Version

## Project Overview

This is a forum built with **Node.js** and **NestJS**, following **Domain-Driven Design (DDD)** and **Clean Architecture** principles. The goal is to create a scalable, testable, and maintainable application, with clear separation of responsibilities and promotion of software engineering best practices.

## Applied DDD Concepts

- **Entities**: Objects with unique identity (e.g., Question, Answer, Comment)
- **Value Objects**: Value objects without identity (e.g., Slug)
- **Repositories**: Abstract data access
- **Use Cases**: Central business logic (e.g., create, edit, search questions/answers)
- **Aggregates**: Group related entities
- **Domain Events**: React to important changes (e.g., notification when an answer is created)

## How to Run

1. Install dependencies:
  ```bash
  pnpm install
  ```
2. Clone the `.env.example` file and rename it to `.env`
3. Run migrations:
  ```bash
  pnpm prisma migrate dev
  ```
4. Start the server:
  ```bash
  pnpm start
  pnpm start:dev
  ```

## Run Tests

Unit Tests
  ```bash
  pnpm test
  ```
Integration (E2E) Tests
  ```bash
  pnpm test:watch
  ```

## Project Structure

- `src/`: Main project code.
- `core/`: Base types, utilities, domain events, and shared errors.
- `domain/`: Subdomains like `forum` and `notification`, organized in application layers and entities.
- `infra/`: External application code, framework, authentication, database, and ORM.
- `test/`: In-memory repositories, factories, and utilities for automated tests.

```
├── 📁 prisma/
│   ├── 📁 migrations/
│   └── 📄 schema.prisma
├── 📁 src/
│   ├── 📁 core/
│   │   ├── 📁 entities/
│   │   │   ├── 📄 aggregate-root.ts
│   │   │   ├── 📄 entity.ts
│   │   │   ├── 📄 unique-entity-id.ts
│   │   │   ├── 📄 watched-list.spec.ts
│   │   │   └── 📄 watched-list.ts
│   │   ├── 📁 errors/
│   │   │   ├── 📁 errors/
│   │   │   │   ├── 📄 not-allowed-error.ts
│   │   │   │   └── 📄 resource-not-found-error.ts
│   │   │   └── 📄 use-case-error.ts
│   │   ├── 📁 events/
│   │   │   ├── 📄 domain-event.ts
│   │   │   ├── 📄 domain-events.spec.ts
│   │   │   ├── 📄 domain-events.ts
│   │   │   └── 📄 event-handler.ts
│   │   ├── 📁 repositories/
│   │   │   └── 📄 pagination-params.ts
│   │   ├── 📁 types/
│   │   │   └── 📄 optional.ts
│   │   ├── 📄 either.spec.ts
│   │   └── 📄 either.ts
│   ├── 📁 domain/
│   │   ├── 📁 forum/
│   │   │   ├── 📁 application/
│   │   │   │   ├── 📁 cryptography/
│   │   │   │   │   ├── 📄 encrypter.ts
│   │   │   │   │   ├── 📄 hash-comparer.ts
│   │   │   │   │   └── 📄 hash-generator.ts
│   │   │   │   ├── 📁 repositories/
│   │   │   │   │   ├── 📄 answer-attachments-repository.ts
│   │   │   │   └── 📁 use-cases/
│   │   │   │       ├── 📁 errors/
│   │   │   │       │   └── 📄 wrong-credentials-error.ts
│   │   │   │       └── 📄 register-student.ts
│   │   │   └── 📁 enterprise/
│   │   │       ├── 📁 entities/
│   │   │       │   ├── 📁 value-objects/
│   │   │       │   │   ├── 📄 slug.test.ts
│   │   │       │   │   └── 📄 slug.ts
│   │   │       │   └── 📄 student.ts
│   │   │       └── 📁 events/
│   │   │           └── 📄 question-best-answer-chosen-event.ts
│   │   └── 📁 notification/
│   │       ├── 📁 application/
│   │       │   ├── 📁 repositories/
│   │       │   │   └── 📄 notifications-repository.ts
│   │       │   ├── 📁 subscribers/
│   │       │   │   ├── 📄 on-question-best-answer-chosen.spec.ts
│   │       │   │   └── 📄 on-question-best-answer-chosen.ts
│   │       │   └── 📁 use-case/
│   │       │       ├── 📄 send-notification.spec.ts
│   │       │       └── 📄 send-notification.ts
│   │       └── 📁 enterprise/
│   │           └── 📁 entities/
│   │               └── 📄 notification.ts
│   └── 📁 infra/
│       ├── 📁 auth/
│       │   ├── 📄 auth.module.ts
│       │   ├── 📄 current-user-decorator.ts
│       │   ├── 📄 jwt-auth-guard.ts
│       │   ├── 📄 jwt.strategy.ts
│       │   └── 📄 public.ts
│       ├── 📁 cryptography/
│       │   ├── 📄 bcrypt-hasher.ts
│       │   ├── 📄 cryptography.module.ts
│       │   └── 📄 jwt-encrypter.ts
│       ├── 📁 database/ 🚫 (auto-hidden)
│       ├── 📁 env/ 🚫 (auto-hidden)
│       ├── 📁 http/
│       │   ├── 📁 controllers/
│       │   │   ├── 📄 fetch-recent-questions.controller.e2e-spec.ts
│       │   │   └── 📄 fetch-recent-questions.controller.ts
│       │   ├── 📁 pipes/
│       │   │   └── 📄 zod-validation-pipe.ts
│       │   ├── 📁 presenters/
│       │   │   └── 📄 question-presenter.ts
│       │   └── 📄 http.module.ts
│       ├── 📄 app.module.ts
│       └── 📄 main.ts
├── 📁 test/
│   ├── 📁 cryptography/
│   │   ├── 📄 fake-encrypter.ts
│   │   └── 📄 fake-hasher.ts
│   ├── 📁 factories/
│   │   └── 📄 make-student.ts
│   ├── 📁 repositories/
│   │   └── 📄 in-memory-students-repository.ts
│   ├── 📁 utils/
│   │   └── 📄 wait-for.ts
│   └── 📄 setup-e2e.ts
├── ⚙️ docker-compose.yml
├── 📄 eslint.config.mjs
├── 📄 nest-cli.json
├── 📄 package.json
├── ⚙️ pnpm-lock.yaml
├── 📖 readme.md
├── 📄 tsconfig.json
├── 📄 vitest.config.e2e.ts
└── 📄 vitest.config.ts
```
