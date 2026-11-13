// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Defina o endereço final da página (sem barra no fim) para o Astro emitir a tag
	// <link rel="canonical"> e a og:image com URL absoluta. Ex.: 'https://seudominio.com.br'
	// site: 'https://seudominio.com.br',

	build: {
		// Embute o CSS no HTML: a página tem um único CSS e ele bloqueava a primeira renderização
		// (uma requisição a menos no caminho crítico).
		inlineStylesheets: 'always',
	},
});
