// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Defina o endereço final da página (sem barra no fim) para o Astro emitir a tag
	// <link rel="canonical"> e a og:image com URL absoluta. Ex.: 'https://seudominio.com.br'. A versão com www é a oficial (o domínio sem www redireciona para ela).
	site: 'https://www.financiamentoblindado.com.br',

	build: {
		// Embute o CSS no HTML: a página tem um único CSS e ele bloqueava a primeira renderização
		// (uma requisição a menos no caminho crítico).
		inlineStylesheets: 'always',
	},
});
