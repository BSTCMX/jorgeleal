/** First paragraph or summary for SEO-visible excerpt (crawlable HTML). */
export function projectExcerpt(text: string, maxLen = 320): string {
  const para = text.split('\n\n')[0]?.trim() ?? text.trim();
  if (para.length <= maxLen) {
    return para;
  }
  const cut = para.slice(0, maxLen);
  return `${cut.replace(/\s+\S*$/, '')}…`;
}

export function projectPath(slug: string): string {
  return `/proyectos/${slug}/`;
}

export function buildProjectJsonLd(params: {
  name: string;
  description: string;
  url: string;
  image?: string;
  sameAs?: string;
}) {
  const { name, description, url, image, sameAs } = params;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'DeveloperApplication',
    author: {
      '@type': 'Person',
      name: 'Jorge Leal',
      url: 'https://jorgelealdev.com/',
    },
    ...(image ? { image: `https://jorgelealdev.com${image}` } : {}),
    ...(sameAs ? { sameAs } : {}),
  };
}
