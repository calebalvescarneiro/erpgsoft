# Convenções de Código

## Naming
- **Pastas**: kebab-case para apps (`web-admin`), snake_case para infraestrutura legada quando necessário.
- **Arquivos TypeScript/JavaScript**: kebab-case; componentes React devem usar PascalCase (`UserMenu.tsx`).
- **Classes**: PascalCase.
- **Variáveis e funções**: camelCase.
- **Constantes**: UPPER_SNAKE_CASE.
- **Commits**: Conventional Commits (`tipo(escopo): mensagem`).

## Feature folders
Organize funcionalidades agrupando domínios completos (componentes, hooks, testes e estilos) no mesmo diretório.

```
src/
  features/
    billing/
      components/
      hooks/
      services/
      tests/
```

Cada feature deve expor apenas uma API pública através de um `index.ts` limpo e documentado.

## Princípios de design
- **DRY (Don't Repeat Yourself)**: extraia utilitários para `packages/` ou camadas compartilhadas sempre que duplicar regras de negócio.
- **KISS (Keep It Simple, Stupid)**: prefira soluções simples, declarativas e com poucas dependências.
- **YAGNI (You Aren't Gonna Need It)**: implemente apenas o necessário para o cenário atual, deixando espaço para evolução incremental.

Ao abrir novas PRs, referencie esta página para justificar decisões arquiteturais.
