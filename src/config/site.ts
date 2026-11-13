/**
 * Configuração central da página de vendas.
 *
 * CHECKOUT_URL — página de compra na Hotmart. Todos os botões (CTAs) da página usam este valor;
 * para trocar o link de checkout, altere apenas esta linha.
 */
export const CHECKOUT_URL = 'https://pay.hotmart.com/P108345128M?off=i5np8244&bid=1794526484497';

/**
 * Dados da empresa, usados no rodapé e nas páginas de Termos de Uso e Política de Privacidade.
 * O CNPJ foi fornecido pelo cliente (já constava no rodapé).
 */
export const EMPRESA = {
  nome: 'Haus Credi',
  cnpj: '28.103.229/0001-70',
  cidade: 'São Paulo - SP',
  /** Município (foro dos Termos de Uso). */
  municipio: 'São Paulo',
  email: 'atendimento@hauscredi.com.br',
  /** Data da última revisão dos textos legais. */
  atualizacao: '13 de novembro de 2026',
} as const;

export const SITE = {
  name: 'Financiamento Blindado - Minha Casa Minha Vida',
  title: 'Financiamento Blindado - Minha Casa Minha Vida',
  description: 'Venda mais imóveis na planta sem travar no financiamento',
  locale: 'pt_BR',
  /** ID de medição do Google Analytics 4 (fluxo de dados "Financiamento Blindado - Minha Casa Minha Vida"). */
  gaId: 'G-GVZVLJ364M',
  /** Pixel da Meta (Gerenciador de Eventos > conjunto de dados "Financiamento Blindado - Minha Casa Minha Vida"). */
  metaPixelId: '1901474004550492',
  /** Imagem de prévia ao compartilhar o link (WhatsApp, Instagram, LinkedIn): 1200 × 630, em /public. */
  image: '/og.jpg',
  themeColor: '#0e1a13',
} as const;
