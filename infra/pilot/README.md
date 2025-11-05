# Ambiente de Testes / Piloto

Este ambiente foi preparado para validar o MVP com clientes-alvo de forma integrada. O `docker-compose.yml` provisiona os três serviços principais:

- **Auth Service** (`http://localhost:3001`): autenticação multi-tenant com RBAC.
- **Billing Service** (`http://localhost:3002`): gestão de planos Start/Growth/Scale, período de trial e taxas por transação.
- **PDV Web** (`http://localhost:5173`): primeiro módulo do PDV com suporte offline.

## Pré-requisitos

- Docker 20+
- Docker Compose 2+
- PNPM habilitado via Corepack (caso deseje rodar os serviços localmente sem Docker)

## Subindo o ambiente

```bash
docker compose up --build
```

O comando irá compilar as imagens dos três serviços, instalar dependências e disponibilizar as portas mapeadas. Após o boot:

1. Acesse `http://localhost:5173` para abrir o PDV web.
2. Utilize o tenant `demo-retail`, e-mail `demo@erpgsoft.com` e senha `ChangeMe123!` para efetuar o login.
3. Selecione um caixa e navegue pelo catálogo básico já sincronizado para modo offline.

## Dados de demonstração

- Tenants `demo-retail` e `demo-services` já estão pré-carregados no Auth Service.
- Convites de usuário são provisionados com senha temporária `ChangeMe123!`.
- O Billing Service suporta cadastro de assinatura e simulação de cobrança para os três planos definidos.

## Observabilidade e próximos passos

- Os serviços expõem logs no stdout. Recomenda-se integrar com CloudWatch/Prometheus nas próximas iterações.
- Ajustar Dockerfiles para builds multi-stage e adicionar testes automatizados na pipeline antes de promover novos releases para clientes pilotos.
