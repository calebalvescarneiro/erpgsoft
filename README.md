# erpgsoft monorepo

Monorepo inicial da ERPGSoft estruturado para aplicações, serviços e infraestrutura compartilharem toolchain comum.

## Estrutura

- `apps/`: clientes finais (web, mobile, desktop) que consomem os pacotes compartilhados.
- `services/`: backends, jobs e APIs.
- `infra/`: infraestrutura como código e pipelines.
- `packages/`: bibliotecas e configurações compartilhadas.
- `docs/`: documentação arquitetural e guias de convenções.

## Tooling

- [Turborepo](https://turbo.build/) para orquestrar builds, lints e testes.
- TypeScript com presets compartilhados em `@erpgsoft/tsconfig`.
- ESLint padronizado por `@erpgsoft/eslint-config`.
- Prettier alinhado via `@erpgsoft/prettier-config`.

Para instalar dependências utilize [pnpm](https://pnpm.io):

```bash
pnpm install
```

Execute os comandos comuns pela raiz:

```bash
pnpm lint
pnpm build
pnpm format
```

Mais detalhes sobre convenções estão em `docs/conventions/`.
