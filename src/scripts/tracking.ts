/**
 * Rastreamento do clique no botão de compra.
 *
 * Todos os botões da página levam ao checkout da Hotmart (CHECKOUT_URL). Um único ouvinte de clique
 * no documento avisa as duas ferramentas quando o visitante clica em qualquer um deles:
 *  - Pixel da Meta: evento padrão "InitiateCheckout" (Iniciar finalização da compra);
 *  - Google Analytics 4: evento padrão "begin_checkout".
 * As duas ferramentas ficam em fila no <head> e baixam depois do load (src/layouts/Layout.astro); se alguma estiver bloqueada
 * (bloqueador de anúncios), o clique segue normalmente — só o aviso não é enviado.
 */
import { CHECKOUT_URL } from '../config/site';

declare global {
	interface Window {
		fbq?: (...args: unknown[]) => void;
		gtag?: (...args: unknown[]) => void;
	}
}

const checkoutHost = new URL(CHECKOUT_URL).hostname;

document.addEventListener('click', (event) => {
	const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]');
	if (!link || link.hostname !== checkoutHost) return;

	try {
		window.fbq?.('track', 'InitiateCheckout');
		window.gtag?.('event', 'begin_checkout');
	} catch {
		// o rastreamento nunca pode impedir a navegação para o checkout
	}
});
