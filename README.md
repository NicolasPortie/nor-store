# NØR / Drop 001

> **Projeto de portfólio, sem fins comerciais.** A NØR é uma marca fictícia criada só para este estudo de front-end. Não existe loja, produtos à venda, estoque, checkout nem empresa com esse nome. Personagens, peças e textos são conteúdo de demonstração.

Demo de uma landing de e-commerce editorial, feita para praticar direção de arte, animação e interação na web. Em vez de abrir numa grade de produtos, a navegação acompanha uma sequência visual que apresenta materiais, silhuetas e detalhes antes de chegar à coleção.

Demo online: [nor.nicolasportie.com](https://nor.nicolasportie.com)

## Preview

![Personagem NØR no estúdio vermelho](public/assets/optimized/img2-personagem.webp)
![Tênis NØR 001 no fundo vermelho](public/assets/optimized/nor-001-sneaker-packshot-red.webp)

## A experiência

- Filme de abertura guiado pelo scroll, com vídeo codificado com keyframes densos para scrub suave.
- Scroll inercial (Lenis) sincronizado com o ScrollTrigger.
- Símbolo Ø em 3D (Three.js), carregado sob demanda e com fallback sem WebGL.
- Sequências dedicadas para a Tech Shell e o NØR 001.
- Lookbook horizontal e catálogo de oito peças.
- Sacola de demonstração, persistida localmente no navegador (não finaliza compra).
- Conteúdo em português e inglês.

## Stack

- React 19 e TypeScript
- Vite
- GSAP (ScrollTrigger, SplitText, ScrollToPlugin) e Lenis
- Three.js (cena do símbolo, carregada via import dinâmico)
- Fontes locais: Archivo (variável, eixo de largura), Inter e JetBrains Mono
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
  lib/            GSAP, scroll suave (Lenis), cena 3D e utilidades de movimento
  styles/         CSS por seção
tests/            Testes de integridade do catálogo
```

## Notas

Este repositório é uma experiência front-end para portfólio. Os produtos são fictícios, a sacola só guarda dados no `localStorage` do navegador e não há checkout, pagamento, back-end ou coleta de dados: o formulário de newsletter e o e-mail de contato do rodapé também são apenas ilustrativos.

## Licença

Projeto pessoal de portfólio de Nicolas Portie. Todos os direitos reservados; as imagens e os textos não devem ser reutilizados sem autorização.
