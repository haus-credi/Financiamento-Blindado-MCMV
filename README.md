# Financiamento Blindado para Corretores — página de vendas

Página de vendas estática feita em [Astro](https://astro.build): 8 dobras + rodapé, sem framework de interface no navegador, só HTML, CSS e um script pequeno de movimento.

## Comandos

Rode na raiz do projeto.

| Comando           | O que faz                                                  |
| :---------------- | :--------------------------------------------------------- |
| `npm install`     | Instala as dependências                                    |
| `npm run dev`     | Servidor local em `http://localhost:4321`                  |
| `npm run build`   | Gera o site final na pasta `dist/` (é o que vai ao ar)     |
| `npm run preview` | Abre o `dist/` localmente, para conferir antes de publicar |

## Estrutura

```text
/
├── public/                 arquivos servidos como estão (favicon, fontes, textura, robots.txt)
├── src/
│   ├── assets/             imagens que o Astro otimiza no build (WebP/JPG responsivos)
│   │   ├── hero/
│   │   └── sections/
│   ├── components/
│   │   ├── sections/       uma dobra por arquivo (Hero, Dor, Transformacao, ...)
│   │   └── ui/             peças reutilizáveis (Botao, CtaButton, ícones)
│   ├── config/site.ts      textos de SEO e o link de checkout (CHECKOUT_URL)
│   ├── layouts/Layout.astro   <head>, fontes e o script de movimento
│   ├── pages/index.astro   monta a página: dobras na ordem
│   ├── scripts/motion.ts   efeitos de entrada e rolagem
│   └── styles/             tokens do Design System, fontes, botões, estilos globais
├── templates/              material de referência, NÃO vai para o site
│   ├── design-system-final/   Design System (identidade visual completa)
│   └── hero-alternativa/      foto da Hero versão A (não usada)
├── astro.config.mjs
└── package.json
```

## Antes de publicar

1. **Checkout.** Todos os botões levam à página de compra na Hotmart. Para trocar o link, altere `CHECKOUT_URL` em `src/config/site.ts`.
2. **Domínio.** Defina `site: 'https://seudominio.com.br'` em `astro.config.mjs`. Com isso a página passa a ter a tag `canonical`.
3. **Imagem de compartilhamento.** Passe a prop `image` ao `Layout` (1200 × 630) para o WhatsApp, o Instagram e o LinkedIn mostrarem uma prévia.

## Publicação (Vercel / Netlify / Cloudflare Pages)

- Comando de build: `npm run build`
- Pasta de saída: `dist`
- Node: 22 ou mais novo
