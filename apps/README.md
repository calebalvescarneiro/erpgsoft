# Apps

Aplicações voltadas para usuários finais (web, mobile, desktop). Cada app deve viver em um subdiretório próprio e consumir os pacotes compartilhados via `packages/`.

## Estrutura sugerida
- `web/` – clientes web construídos com frameworks como Vite/React.
- `mobile/` – clientes mobile (React Native, Flutter, etc.).

Cada aplicação deve conter seus próprios scripts de build/test e estender as configurações compartilhadas de TypeScript, ESLint e Prettier.

## Aplicações disponíveis

- `pdv-web/` – módulo inicial do PDV com login, seleção de caixa e catálogo offline-first.
