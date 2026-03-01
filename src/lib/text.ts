/**
 * Text utilities: HTML escaping and URL linkification.
 * Used for safe rendering of user/content text that may contain URLs.
 */

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escape a string for safe use inside HTML text content.
 * Prevents XSS when interpolating into DOM.
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char);
}

/**
 * Escape a string for safe use inside an HTML attribute value (e.g. href).
 */
export function escapeAttr(str: string): string {
  return str.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char);
}

/** Regex to match URLs (http/https) for linkification. Stops at whitespace or unsafe chars. */
const URL_REGEX = /https?:\/\/[^\s<>"']+/g;

/**
 * Converts plain text to HTML with URLs wrapped in anchor tags.
 * Escapes all non-URL text to prevent XSS. URLs open in new tab with security attributes.
 * Reusable for any project description or content that may contain links.
 */
export function linkify(text: string): string {
  if (!text || typeof text !== 'string') return '';
  const parts = text.split(URL_REGEX);
  const urls = text.match(URL_REGEX) ?? [];
  let out = '';
  for (let i = 0; i < parts.length; i++) {
    out += escapeHtml(parts[i]!);
    if (i < urls.length) {
      const rawUrl = urls[i]!;
      const hrefUrl = rawUrl.replace(/[.,;:!?)]+$/, '');
      const safeUrl = escapeAttr(hrefUrl);
      const safeDisplay = escapeHtml(rawUrl);
      out += `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">${safeDisplay}</a>`;
    }
  }
  return out;
}
