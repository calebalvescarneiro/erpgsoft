# Auth Service

Serviço de autenticação multi-tenant com RBAC básico construído em NestJS. Fornece endpoints para convite de usuários, registro e login, além de emissão de tokens JWT com expiração de 1 hora.

## Endpoints principais

- `POST /auth/invite` – Convida usuários para o tenant atual (header `x-tenant-id`). Requer papel mínimo `manager`.
- `POST /auth/register` – Conclui o cadastro de um convite.
- `POST /auth/login` – Autentica usuário e retorna token JWT.
- `GET /auth/users` – Lista usuários do tenant com seus papéis.

O guard de RBAC utiliza hierarquia (`viewer < cashier < manager < owner`) para validar permissões.

## Execução local

```bash
pnpm install
pnpm start
```

Defina `JWT_SECRET` para produção. O serviço inicializa com tenants de demonstração `demo-retail` e `demo-services`.
