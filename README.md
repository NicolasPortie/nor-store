# NØR / Drop 001

Storefront editorial do primeiro drop da NØR. Em vez de abrir numa grade de produtos, a navegação acompanha uma sequência visual que apresenta materiais, silhuetas e detalhes antes de chegar à coleção.

Site: [nor.nicolasportie.com](https://nor.nicolasportie.com)

## Preview

![Personagem NØR no estúdio vermelho](public/assets/optimized/img2-personagem.webp)
![Tênis NØR 001 no fundo vermelho](public/assets/optimized/nor-001-sneaker-packshot-red.webp)

## A experiência

- Filme de abertura guiado pelo scroll.
- Sequências dedicadas para a Tech Shell e o NØR 001.
- Lookbook horizontal e catálogo de oito peças.
- Sacola persistida localmente no navegador.
- Conteúdo em português e inglês.

## Stack

- React 19 e TypeScript
- Vite
- GSAP (ScrollTrigger, SplitText, ScrollToPlugin)
- Tailwind CSS e CSS customizado
- Phosphor Icons

## Rodando localmente

Pré-requisito: Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run typecheck
npm run test
npm run build
npm run preview
```

Formatação com Prettier (`npm run format`, conferência com `npm run format:check`).

## Estrutura

```
src/
  App.tsx         Composição da página
  components/     Seções da página e UI (filme, sequências, lookbook, sacola)
  data/           Catálogo de produtos e lookbook
  hooks/          Estado da sacola
  i18n/           Conteúdo em português e inglês
  lib/            Configuração do GSAP e utilidades de movimento
  styles/         CSS por seção
tests/            Testes de integridade do catálogo
```

## Notas

O projeto é uma experiência front-end. A sacola funciona no navegador e não inclui checkout ou processamento de pagamentos.

## Licença

Todos os direitos reservados à NØR.
