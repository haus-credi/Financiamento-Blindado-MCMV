/**
 * Movimento das dobras (mínimo e opcional: sem JS, ou com
 * prefers-reduced-motion, todo o conteúdo já aparece pronto).
 *  - .rv           → recebe .is-in quando entra na tela ("appear" do DS)
 *  - .rv[data-rv-cedo] → o mesmo, mas dispara assim que o elemento SURGE na borda de baixo
 *                    (e até um pouco antes). Para peças pequenas no fim de um bloco longo, como
 *                    o botão do FAQ, que senão esperam entrar 12% e parecem atrasadas.
 *  - [data-words]  → cada palavra acende 0.2 → 1 conforme o scroll
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- appear
const reveals = [...document.querySelectorAll<HTMLElement>('.rv')];
if (reduce || !('IntersectionObserver' in window)) {
	reveals.forEach((el) => el.classList.add('is-in'));
} else {
	const quandoEntrar: IntersectionObserverCallback = (entries, obs) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			entry.target.classList.add('is-in');
			obs.unobserve(entry.target);
		}
	};
	// padrão: 12% do elemento precisa estar dentro, 6% acima da borda de baixo
	const io = new IntersectionObserver(quandoEntrar, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
	// cedo: qualquer pixel, já 18% da janela antes de aparecer (a entrada de 0,65s está quase
	// pronta quando o botão chega na borda de baixo)
	const ioCedo = new IntersectionObserver(quandoEntrar, { threshold: 0, rootMargin: '0px 0px 18% 0px' });
	reveals.forEach((el) => (el.hasAttribute('data-rv-cedo') ? ioCedo : io).observe(el));
}

// ----------------------------------------------------------- palavras / scroll
function wrapWords(root: HTMLElement): HTMLElement[] {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	const nodes: Text[] = [];
	while (walker.nextNode()) nodes.push(walker.currentNode as Text);

	const words: HTMLElement[] = [];
	for (const node of nodes) {
		const frag = document.createDocumentFragment();
		for (const part of (node.textContent ?? '').split(/(\s+)/)) {
			if (!part) continue;
			if (/^\s+$/.test(part)) {
				frag.append(part);
				continue;
			}
			const span = document.createElement('span');
			span.className = 'wd';
			span.textContent = part;
			frag.append(span);
			words.push(span);
		}
		node.replaceWith(frag);
	}
	return words;
}

// ------------------------------------------------- etapas por scroll
// [data-scrolly] é a pista de rolagem; [data-step-slot] é a janela que fica
// fixa (sticky) dentro dela; [data-step-item] são as etapas (uma ativa por
// vez). O CSS decide se isso vale
// (desktop, JS e movimento normal); nos outros casos tudo fica empilhado.
const scrollies = [...document.querySelectorAll<HTMLElement>('[data-scrolly]')];

// REGRA DE ENTRADA (a mesma do .rv acima): a rolagem comanda a ENTRADA, mas o que já entrou
// não sai mais. Subir de volta pela dobra não apaga quadrantes, a frase final nem as palavras
// já acesas. Guarda, por pista, o quadrante mais avançado já alcançado e se a frase já subiu.
const jaEntrou = new WeakMap<HTMLElement, { idx: number; done: boolean }>();

function updateScrollies() {
	for (const root of scrollies) {
		const slot = root.querySelector<HTMLElement>('[data-step-slot]');
		const items = [...root.querySelectorAll<HTMLElement>('[data-step-item]')];
		if (!slot || !items.length) continue;
		const r = root.getBoundingClientRect();
		const stick = parseFloat(getComputedStyle(slot).top) || 0;
		// Padrão: cada troca de card custa o MESMO tanto de rolagem, em pixels fixos
		// (--step, 120px). O card 1 entra --lead px antes de o palco travar.
		// s = pixels rolados depois do ponto em que o palco trava (negativo antes dele).
		const cs = getComputedStyle(root);
		const step = parseFloat(cs.getPropertyValue('--step')) || 120;
		const lead = parseFloat(cs.getPropertyValue('--lead')) || 0;
		const s = stick - r.top;
		const k = Math.floor((s + lead) / step);
		// antes do ponto de entrada nenhum card está ativo: o 1º entra (pela esquerda)
		// como as trocas seguintes
		const agora = k < 0 ? -1 : Math.min(items.length - 1, k);
		// a frase final sobe --gap px depois de o último card entrar
		const gap = parseFloat(cs.getPropertyValue('--gap')) || 0;
		const fraseAgora = s + lead >= (items.length - 1) * step + gap;
		// nunca recua: vale o ponto mais avançado já alcançado
		const antes = jaEntrou.get(root) ?? { idx: -1, done: false };
		const idx = Math.max(antes.idx, agora);
		const done = antes.done || fraseAgora;
		jaEntrou.set(root, { idx, done });
		root.dataset.done = String(done);
		items.forEach((el, i) => {
			el.classList.toggle('is-active', i === idx);
			el.classList.toggle('is-past', i < idx);
		});
	}
}

const blocks = [...document.querySelectorAll<HTMLElement>('[data-words]')].map((el) => ({
	el,
	words: wrapWords(el),
	// quantas palavras já acenderam, no máximo: depois de acesa, a palavra não apaga mais
	acesas: 0,
}));

function update() {
	const vh = innerHeight;
	updateScrollies();
	for (const bloco of blocks) {
		const { el, words } = bloco;
		if (reduce) {
			words.forEach((w) => w.classList.add('on'));
			continue;
		}
		const r = el.getBoundingClientRect();
		// 0 quando o topo entra por baixo; 1 quando o bloco sobe até ~2/3 da tela
		// (ou já está inteiro na parte de cima: assim o fim da página também acende)
		const p =
			r.bottom < vh * 0.92
				? 1
				: Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (vh * 0.2 + r.height * 0.2)));
		// dentro do palco parado, depois do último card tudo fica aceso
		const done = el.closest<HTMLElement>('[data-scrolly]')?.dataset.done === 'true';
		bloco.acesas = Math.max(bloco.acesas, done ? words.length : Math.ceil(p * words.length));
		words.forEach((w, i) => w.classList.toggle('on', i < bloco.acesas));
	}
}

if (blocks.length || scrollies.length) {
	let ticking = false;
	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			update();
			ticking = false;
		});
	};
	addEventListener('scroll', onScroll, { passive: true });
	addEventListener('resize', onScroll);
	update();
}
