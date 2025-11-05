# Services

Serviços de backend, APIs e workers. Cada serviço deve residir em um subdiretório próprio e usar os pacotes compartilhados quando aplicável.

Sugestão:
- `api/` – serviços HTTP/GraphQL.
- `jobs/` – workers assíncronos, filas, cronjobs.

## Serviços disponíveis

- `auth-service/` – autenticação multi-tenant com RBAC e emissão de tokens JWT.
- `billing-service/` – gestão de planos Start/Growth/Scale com trial e taxas por transação.
- `fiscal-service/` – cálculo tributário multi-regime (CPF, MEI, Simples, Lucro Presumido/Real), registro de documentos e fila de contingência NFC-e.
- `loyalty-service/` – carteira digital unificada com pontos, cashback, gift cards e regras de resgate configuráveis.
- `integrations-service/` – catálogo e orquestração de conectores externos (iFood, WhatsApp, TEF, cardápio online) com sincronização e armazenamento de webhooks.
