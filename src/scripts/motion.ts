/**
 * Movimento das dobras (mínimo e opcional: sem JS, ou com
 * prefers-reduced-motion, todo o conteúdo já aparece pronto).
 *  - .rv           → recebe .is-in quando entra na tela ("appear" do DS)
 *  - [data-words]  → cada palavra acende 0.2 → 1 conforme o scroll
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- appear
const reveals = document.querySelectorAll<HTMLElement>('.rv');
if (reduce || !('IntersectionObserver' in window)) {
	reveals.forEach((el) => el.classList.add('is-in'));
} else {
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add('is-in');
				io.unobserve(entry.target);
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
	);
	reveals.forEach((el) => io.observe(el));
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
		const idx = k < 0 ? -1 : Math.min(items.length - 1, k);
		// a frase final sobe --gap px depois de o último card entrar
		const gap = parseFloat(cs.getPropertyValue('--gap')) || 0;
		root.dataset.done = String(s + lead >= (items.length - 1) * step + gap);
		items.forEach((el, i) => {
			el.classList.toggle('is-active', i === idx);
			el.classList.toggle('is-past', i < idx);
		});
	}
}

const blocks = [...document.querySelectorAll<HTMLElement>('[data-words]')].map((el) => ({
	el,
	words: wrapWords(el),
}));

function update() {
	const vh = innerHeight;
	updateScrollies();
	for (const { el, words } of blocks) {
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
		const lit = done ? words.length : Math.ceil(p * words.length);
		words.forEach((w, i) => w.classList.toggle('on', i < lit));
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
