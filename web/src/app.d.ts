// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {}

	interface ImportMetaEnv {
		/** Webshop URL; defaults to https://shop.mrjsa.com (http://localhost:8080 in dev). */
		readonly VITE_SHOP_URL?: string;
	}
}

export {};
