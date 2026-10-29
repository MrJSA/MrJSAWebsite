import { page } from '$app/state';
import { langOf, localize, ui } from './i18n';

/**
 * The current page's language, its UI labels and a link helper. Use as
 * `const { lang, t, href } = $derived(locale());` in a component.
 */
export function locale() {
	const lang = langOf(page.url.pathname);
	return { lang, t: ui[lang], href: (path: string) => localize(path, lang) };
}
