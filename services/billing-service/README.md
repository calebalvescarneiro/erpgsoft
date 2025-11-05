# Billing Service

Serviço responsável por gestão de planos e faturamento dos tenants. Implementado em NestJS com estado em memória para facilitar pilotos.

## Funcionalidades

- Cadastro de assinaturas nos planos Start, Growth e Scale.
- Cálculo automático de término de trial com base no plano.
- Registro de uso (transações e volume) e cálculo de fatura mensal incluindo taxas por transação.
- Registro de eventos financeiros (`subscription_fee` e `transaction_fee`).

## Endpoints principais

- `GET /billing/plans` – Lista planos disponíveis.
- `POST /billing/subscriptions` – Cria nova assinatura.
- `POST /billing/subscriptions/:id/cancel` – Cancela assinatura.
- `GET /billing/subscriptions/:id/invoice` – Calcula valores de cobrança para o ciclo atual.
- `POST /billing/transactions` – Registra cobrança manual para o tenant associado.

## Execução local

```bash
pnpm install
pnpm start
```

Para produção recomenda-se persistência real (PostgreSQL) e integração com gateway de pagamentos.
