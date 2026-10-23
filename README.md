# NØR / Drop 001

Landing de e-commerce editorial com movimento guiado pelo scroll, símbolo 3D interativo e conteúdo bilíngue (PT/EN).

**[Ver demo online → nor.nicolasportie.com](https://nor.nicolasportie.com)**

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?logo=threedotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88ce02?logo=greensock&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss&logoColor=white)

> **Projeto de portfólio, sem fins comerciais.** A NØR é uma marca fictícia criada apenas como estudo de front-end. Não existe loja, produto à venda, estoque, checkout nem empresa com esse nome. Personagens, peças e textos são conteúdo de demonstração.

![Personagem NØR no estúdio vermelho](public/assets/optimized/img2-personagem.webp)

## Sobre o projeto

Em vez de abrir numa grade de produtos, a página conta uma história: o scroll conduz um filme de abertura, apresenta materiais, silhuetas e detalhes e só então chega à coleção. O objetivo foi exercitar direção de arte, coreografia de animação e engenharia de performance numa página que precisa continuar rápida, acessível e legível apesar de ser pesada em mídia.

## Destaques

- **Filme guiado pelo scroll.** O vídeo de abertura é codificado com keyframes densos, o que permite avançar e retroceder quadro a quadro sem travar.
- **Scroll inercial sincronizado.** Lenis alimenta o ScrollTrigger do GSAP, então animações e posição de rolagem usam a mesma fonte de verdade.
- **Símbolo Ø em 3D.** Cena em Three.js com anel chanfrado, barra cromada, ambiente de estúdio customizado, sombra de contato, inclinação por ponteiro, arrastar com retorno elástico e giro ao clicar.
- **Sequências dedicadas** para a Tech Shell e o tênis NØR 001, mais um lookbook horizontal e um catálogo de oito peças.
- **Sacola de demonstração** persistida no `localStorage`, com drawer acessível.
- **Bilíngue.** Conteúdo completo em português e inglês, com a escolha lembrada entre visitas.
- **Deep links.** Âncoras como `#shop` e `#look` reposicionam a página corretamente mesmo depois dos recálculos do ScrollTrigger.

## Decisões técnicas

| Tema | Decisão |
| --- | --- |
| **Carga inicial** | A cena Three.js (~560 kB) fica num chunk separado, carregado por `import()` dinâmico só quando a seção do símbolo é usada. O bundle principal fica em ~400 kB. |
| **Sem WebGL** | Se o navegador não oferece WebGL, o símbolo 3D simplesmente não é montado e o "Ø" estático permanece. A página continua completa. |
| **Movimento reduzido** | O código respeita `prefers-reduced-motion`, com utilitários de movimento centralizados em `src/lib/motion.ts` e cobertos por testes. |
| **Acessibilidade** | Link de pular para o conteúdo, `inert` no conteúdo de fundo enquanto a sacola ou o menu estão abertos, contagem da sacola em `aria-live` e `lang` correto. |
| **Imagens** | Imagens otimizadas em WebP, com preload da imagem de maior destaque. |
| **Tipografia** | Fontes locais (Archivo variável com eixo de largura, Inter e JetBrains Mono), sem requisições a terceiros. |
| **SEO e compartilhamento** | Meta tags Open Graph e Twitter, URL canônica, `robots.txt`, `sitemap.xml` e `llms.txt`. |
| **CSS** | Tailwind para a base e CSS por seção em `src/styles/`, mantendo cada bloco da página isolado e fácil de localizar. |

## Stack

- **Interface:** React 19, TypeScript, Vite 7
- **Animação:** GSAP (ScrollTrigger, SplitText, ScrollToPlugin), Lenis
- **3D:** Three.js
- **Estilo:** Tailwind CSS 4 e CSS customizado
- **Ícones e fontes:** Phosphor Icons, Archivo, Inter, JetBrains Mono
- **Qualidade:** Vitest, Prettier, `tsc --noEmit`

## Como rodar

Pré-requisito: Node.js 20.19+ ou 22.12+.

```bash
git clone https://github.com/NicolasPortie/nor-store.git
cd nor-store
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run typecheck` | Verificação de tipos sem gerar arquivos |
| `npm test` | Testes unitários (Vitest) |
| `npm run format` / `npm run format:check` | Formata ou confere o código com Prettier |

## Estrutura

```
src/
  App.tsx         Composição da página
  components/     Seções e UI (filme, sequências, lookbook, símbolo, sacola)
  data/           Catálogo de produtos e lookbook
  hooks/          Estado da sacola
  i18n/           Conteúdo em português e inglês
  lib/            GSAP, scroll suave, cena 3D e utilidades de movimento
  styles/         CSS por seção
public/           Imagens otimizadas, vídeo, favicon e arquivos de SEO
tests/            Testes do catálogo e das utilidades de movimento
```

## Deploy

O site é publicado no Cloudflare Pages com integração ao GitHub: cada push na `main` dispara um build automático.

| Configuração | Valor |
| --- | --- |
| Comando de build | `npm run build` |
| Diretório de saída | `dist` |
| Variável de ambiente | `NODE_VERSION=22` |

## Escopo e limitações

Este repositório é uma experiência de front-end. Os produtos são fictícios, a sacola guarda dados apenas no `localStorage` do navegador e não há checkout, pagamento, back-end nem coleta de dados. O formulário de newsletter e o e-mail de contato do rodapé são apenas ilustrativos.

## Autor

**Nicolas Portie**
[GitHub](https://github.com/NicolasPortie)

## Licença

Projeto pessoal de portfólio. Todos os direitos reservados: as imagens e os textos não devem ser reutilizados sem autorização.
