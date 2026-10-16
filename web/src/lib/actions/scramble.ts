import type { Action } from 'svelte/action';

const GLYPHS = '01<>/[]{}#$%&*+=?ABCDEFGHJKLMNPRSTUVXYZ';

interface Options {
	/** 'load' starts immediately (above the fold), 'visible' waits until scrolled into view. */
	trigger?: 'load' | 'visible';
	delay?: number;
	/** ms per character until it locks in. */
	speed?: number;
}

/**
 * "Decodes" an element's text from random glyphs, left to right — like a terminal resolving.
 * The real text stays in the HTML (SEO, no-JS) and is exposed via aria-label while animating.
 *
 * For above-the-fold text add `data-scramble`: it is hidden until hydration (see global.css)
 * so visitors never see the plain text flash before it starts decoding.
 */
export const scramble: Action<HTMLElement, Options | undefined> = (node, options = {}) => {
	const { trigger = 'load', delay = 0, speed = 28 } = options;
	const finalText = node.textContent ?? '';
	let frame = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let observer: IntersectionObserver | undefined;

	const show = () => node.style.setProperty('visibility', 'visible');

	if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
		show();
		return;
	}

	function run() {
		node.setAttribute('aria-label', finalText);
		show();
		const start = performance.now();
		const tick = (now: number) => {
			const locked = Math.floor((now - start) / speed);
			let out = '';
			for (let i = 0; i < finalText.length; i++) {
				const ch = finalText[i];
				out += i < locked || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
			}
			node.textContent = out;
			if (locked < finalText.length) {
				frame = requestAnimationFrame(tick);
			} else {
				node.textContent = finalText;
				node.removeAttribute('aria-label');
			}
		};
		frame = requestAnimationFrame(tick);
	}

	if (trigger === 'visible') {
		observer = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				observer?.disconnect();
				timer = setTimeout(run, delay);
			}
		});
		observer.observe(node);
	} else {
		timer = setTimeout(run, delay);
	}

	return {
		destroy() {
			cancelAnimationFrame(frame);
			clearTimeout(timer);
			observer?.disconnect();
			node.textContent = finalText;
		}
	};
};
