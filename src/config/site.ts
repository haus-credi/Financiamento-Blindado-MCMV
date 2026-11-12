/**
 * Configuração central da página de vendas.
 *
 * CHECKOUT_URL — PENDENTE: ainda não há link de checkout definido.
 * Por enquanto todos os CTAs apontam para a âncora da futura seção de oferta
 * (`<section id="oferta">`). Quando o checkout existir, troque apenas este valor.
 */
export const CHECKOUT_URL = '#oferta';

export const SITE = {
  name: 'Financiamento Blindado para Corretores',
  title: 'Financiamento Blindado para Corretores — Venda mais imóveis na planta',
  description:
    'Aprenda a esclarecer dúvidas sobre subsídio, FGTS, renda e financiamento para aproveitar melhor suas oportunidades de venda.',
  locale: 'pt_BR',
  themeColor: '#0e1a13',
} as const;
