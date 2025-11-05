# Services

Serviços de backend, APIs e workers. Cada serviço deve residir em um subdiretório próprio e usar os pacotes compartilhados quando aplicável.

Sugestão:
- `api/` – serviços HTTP/GraphQL.
- `jobs/` – workers assíncronos, filas, cronjobs.

## Serviços disponíveis

- `auth-service/` – autenticação multi-tenant com RBAC e emissão de tokens JWT.
- `billing-service/` – gestão de planos Start/Growth/Scale com trial e taxas por transação.
