import type { Handle } from '@sveltejs/kit/hooks';
import { langOf } from '#lib/i18n.js';

/** Fills `%lang%` in `app.html` (`<html lang="…">`) with the page's language. */
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', langOf(event.url.pathname))
	});
