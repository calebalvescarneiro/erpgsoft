# Arquitetura MVP

## Visão Geral
Descreve a arquitetura alvo para o MVP do ERP, destacando os principais componentes de frontend, backend, dados e integrações externas, alinhada ao plano macro definido para o produto.

## Frontend
- **Tecnologia base**: Aplicação web SPA desenvolvida em React com TypeScript para garantir escalabilidade e tipagem estática.
- **Camadas principais**:
  - _Shell_ modular com roteamento baseado em React Router e carregamento assíncrono de microfrontends quando necessário.
  - Biblioteca de componentes corporativos (Design System) com Storybook para padronização visual e acessibilidade.
  - Gestão de estado usando Redux Toolkit e React Query para dados remotos.
- **Entrega e observabilidade**:
  - Build gerado via Vite e publicado em CDN com versionamento semântico.
  - Monitoramento de UX via LogRocket/Sentry e analytics com Segment.

## Backend
- **Arquitetura**: Serviços desacoplados em uma abordagem modular dentro de um monólito distribuído (modular monolith) para acelerar o MVP e preparar a transição para microsserviços. A fundação já contempla serviços dedicados de autenticação, billing, fiscal, fidelidade/e-wallet e integrações externas.
- **Tecnologias**: Node.js (NestJS) com TypeScript; comunicação síncrona via REST/GraphQL e assíncrona via fila (AWS SQS ou RabbitMQ).
- **Módulos chave**:
  - Autenticação e autorização com suporte a múltiplos tenants, usando OAuth 2.0/OpenID Connect.
  - Gestão fiscal e contábil alinhada à legislação brasileira, com motores de cálculo configuráveis.
  - Módulo financeiro (contas a pagar/receber), estoque e faturamento básico.
  - Carteira digital e programas de fidelidade desacoplados, expostos via API dedicada.
  - Serviço de integrações para orquestrar conectores (iFood, WhatsApp, TEF, cardápio online) e centralizar webhooks.
- **Infraestrutura**:
  - Containerização com Docker e orquestração inicial via AWS ECS.
  - CI/CD utilizando GitHub Actions com pipelines de build, testes e deploy automatizado.
  - Observabilidade com OpenTelemetry, logs centralizados em CloudWatch e métricas no Prometheus/Grafana.

## Dados
- **Bancos operacionais**: PostgreSQL para dados transacionais com esquemas isolados por tenant; Redis para cache e sessões.
- **Armazenamento analítico**: Data lake em S3 com ingestão por jobs noturnos (Airflow) e camada semântica em AWS Athena para relatórios.
- **Governança**:
  - Catálogo de dados com DataHub e políticas de retenção definidas por categoria de dado.
  - Backups automáticos e replicação cross-region.

## Integrações
- **Fiscais**: Integração com SEFAZ via provedores certificados (TecnoSpeed) para emissão de NF-e/NFS-e.
- **Financeiras**: APIs bancárias (Open Finance) para conciliação automática e emissão de boletos via parceiros (Gerencianet, Banco Inter).
- **Terceiros**: Conectores para CRM (HubSpot) e plataformas de e-commerce (VTEX) usando webhooks e filas para sincronização resiliente.

## Serviços implementados para a próxima fase

- **Fiscal Service** (`services/fiscal-service`): calcula tributos para múltiplos regimes (CPF, MEI, Simples, Lucro Presumido/Real), registra documentos fiscais e opera fila de contingência para NFC-e offline.
- **Loyalty Service** (`services/loyalty-service`): gerencia carteiras digitais multi saldo (pontos, cashback, gift card), programas padrões e resgates controlados.
- **Integrations Service** (`services/integrations-service`): centraliza conectores externos, registra credenciais por tenant, dispara sincronizações sob demanda e armazena webhooks em lote para posterior processamento.

## Fluxo de Onboarding Segmentado
1. **Coleta de informações iniciais**
   - Perguntas dinâmicas por segmento (comércio, serviços, indústria) para identificar necessidades fiscais e módulos relevantes.
   - Campos obrigatórios: CNPJ/CPF, regime tributário, volume médio de faturamento, número de usuários e integrações desejadas.
2. **Configuração automatizada**
   - Provisionamento de tenant dedicado com isolamento lógico (schema PostgreSQL e namespaces Redis).
   - Pré-configuração de módulos com base nas respostas (ex.: ativar fiscal avançado para indústria, habilitar conciliação bancária para comércio).
   - Geração de checklists de onboarding por persona (financeiro, fiscal, operações).
3. **Trial guiado**
   - Período de 14 dias com dados de demonstração opcionais e tutoriais in-app (product tours) segmentados.
   - Métricas de engajamento coletadas para scoring de conversão e acionamento de time de vendas/customer success.
4. **Transição para plano pago**
   - Geração automática de proposta com base no uso durante o trial.
   - Integração com gateway de pagamento para assinatura e faturamento recorrente.

## Validações com Áreas Envolvidas
- **Fiscal**
  - _Feedback_: Reforçar conformidade com regimes especiais (Simples Nacional e Lucro Presumido) e prever integração com SPED desde o MVP.
  - _Ajustes aplicados_: Incluída menção a motores de cálculo configuráveis e priorização de integrações fiscais (SEFAZ, SPED) nos módulos backend.
- **Produto**
  - _Feedback_: Garantir experiência de onboarding adaptativa e instrumentação de métricas para testar hipóteses de conversão.
  - _Ajustes aplicados_: Expansão do fluxo de onboarding detalhando perguntas segmentadas, provisionamento automatizado e métricas de trial.

## Próximos Passos
- Detalhar roadmap técnico por release, incluindo SLAs e orçamento de infraestrutura.
- Definir critérios de sucesso para o trial e integrações prioritárias.
