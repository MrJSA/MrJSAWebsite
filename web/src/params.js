// Plain JavaScript: the build imports this file directly in Node, without compiling TypeScript.
import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	/** `[[lang=lang]]` — the language prefix of translated URLs (`/de/…`). Keep in sync with `langs` in `src/lib/i18n.ts`. */
	lang: (/** @type {string} */ param) => (param === 'de' ? param : undefined)
});
