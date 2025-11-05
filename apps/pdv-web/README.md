# PDV Web

Primeiro módulo do PDV web com suporte a autenticação, seleção de caixa e catálogo básico, preparado para modo offline.

## Recursos

- Login integrado ao Auth Service utilizando tenant header.
- Seleção de caixa com persistência local.
- Catálogo offline-first com cache em `localStorage` e service worker para operação sem conexão.
- Layout responsivo pensado para tablets e notebooks em balcão.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Variáveis importantes:

- `VITE_AUTH_URL` – URL do serviço de autenticação.
- `VITE_BILLING_URL` – (futuro) integração com billing para exibir limites.

Para gerar build de produção use `pnpm build` e hospede o diretório `dist/` em CDN compatível.
