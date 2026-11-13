// @ts-check
import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Tira os comentários <!-- ... --> do HTML PUBLICADO (notas de desenvolvimento não precisam ir para o visitante).
 * Os comentários continuam nos arquivos .astro; só a saída do build é limpa. O conteúdo de <script> e <style>
 * não é tocado (os scripts de rastreamento ficam byte a byte iguais).
 */
function removerComentariosHtml() {
	return {
		name: 'remover-comentarios-html',
		hooks: {
			'astro:build:done': async ({ dir }) => {
				const raiz = fileURLToPath(dir);
				const arquivos = (await readdir(raiz, { recursive: true })).filter((f) => f.endsWith('.html'));
				for (const arquivo of arquivos) {
					const caminho = join(raiz, arquivo);
					const html = await readFile(caminho, 'utf8');
					const limpo = html
						.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/i)
						.map((parte, i) => (i % 2 === 1 ? parte : parte.replace(/<!--[\s\S]*?-->/g, '')))
						.join('');
					if (limpo !== html) await writeFile(caminho, limpo);
				}
			},
		},
	};
}

// https://astro.build/config
export default defineConfig({
	integrations: [removerComentariosHtml()],

	// Defina o endereço final da página (sem barra no fim) para o Astro emitir a tag
	// <link rel="canonical"> e a og:image com URL absoluta. Ex.: 'https://seudominio.com.br'. A versão com www é a oficial (o domínio sem www redireciona para ela).
	site: 'https://www.financiamentoblindado.com.br',

	build: {
		// Embute o CSS no HTML: a página tem um único CSS e ele bloqueava a primeira renderização
		// (uma requisição a menos no caminho crítico).
		inlineStylesheets: 'always',
	},
});
