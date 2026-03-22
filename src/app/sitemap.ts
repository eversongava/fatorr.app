import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL em produção
  const baseUrl = 'https://fatorr.app.br';
  const currentDate = new Date();

  // As 8 rotas focadas em captação SEO orgânica que mapeamos anteriormente
  const seoRoutes = [
    '', // Home page
    '/imposto-psicologo',
    '/imposto-medico-pj',
    '/imposto-dentista',
    '/imposto-programador-pj',
    '/calcular-fator-r',
    '/anexo-iii-ou-v',
    '/pagar-menos-imposto-simples',
    '/pro-labore-fator-r'
  ];

  return seoRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
