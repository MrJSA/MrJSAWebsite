import type { Action } from 'svelte/action';

const GLYPHS = '01<>/[]{}#$%&*+=?ABCDEFGHJKLMNPRSTUVXYZ';

interface Options {
	/** The text to decode — the same as the element's content. A new value decodes again (e.g. after a language switch). */
	text: string;
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
 *
 * The element must contain only the text. It is changed in place (never replaced), so Svelte
 * keeps updating the same text node.
 */
export const scramble: Action<HTMLElement, Options> = (node, options) => {
	let { text: finalText, trigger = 'load', delay = 0, speed = 28 } = options;
	let frame = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let observer: IntersectionObserver | undefined;

	const show = () => node.style.setProperty('visibility', 'visible');
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

	function write(text: string) {
		const child = node.firstChild;
		if (child?.nodeType === Node.TEXT_NODE && !child.nextSibling) child.nodeValue = text;
		else node.textContent = text;
	}

	function stop() {
		cancelAnimationFrame(frame);
		clearTimeout(timer);
		observer?.disconnect();
		write(finalText);
		node.removeAttribute('aria-label');
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
			write(out);
			if (locked < finalText.length) {
				frame = requestAnimationFrame(tick);
			} else {
				write(finalText);
				node.removeAttribute('aria-label');
			}
		};
		frame = requestAnimationFrame(tick);
	}

	function start() {
		if (reducedMotion) {
			show();
			return;
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
	}

	start();

	return {
		update(next) {
			if (next.text === finalText) return;
			stop();
			({ text: finalText, trigger = 'load', delay = 0, speed = 28 } = next);
			write(finalText);
			start();
		},
		destroy: stop
	};
};
