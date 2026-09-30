/** Canonical site URL (matches astro.config.mjs `site`). */
export const SITE_ORIGIN = 'https://jorgelealdev.com';

export const PERSON_SAME_AS = [
  'https://github.com/BSTCMX',
  'https://www.linkedin.com/in/jorgelealcornejo',
] as const;

export const DEFAULT_OG_IMAGE = '/images/fotocvdev-lcp-512.webp';

export function buildHomeJsonLd(description: string) {
  const personId = `${SITE_ORIGIN}/#person`;
  const websiteId = `${SITE_ORIGIN}/#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${SITE_ORIGIN}/`,
        name: 'Jorge Leal',
        description,
        inLanguage: 'es',
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Jorge Leal',
        url: `${SITE_ORIGIN}/`,
        image: `${SITE_ORIGIN}${DEFAULT_OG_IMAGE}`,
        jobTitle: 'Ingeniero de software',
        sameAs: [...PERSON_SAME_AS],
        email: 'mailto:jlealcornejo@gmail.com',
      },
    ],
  };
}
