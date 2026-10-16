import type { Action } from 'svelte/action';

/**
 * Fades an element in when it scrolls into view.
 * Usage: `<div use:reveal>` or `<div use:reveal={120}>` (delay in ms).
 */
export const reveal: Action<HTMLElement, number | undefined> = (node, delay = 0) => {
	node.classList.add('reveal');
	if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);

	// Anything already on screen stays visible — no flash on first paint.
	if (node.getBoundingClientRect().top < window.innerHeight) return;

	node.classList.add('reveal-pending');
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.remove('reveal-pending');
					observer.disconnect();
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px' }
	);
	observer.observe(node);

	return { destroy: () => observer.disconnect() };
};
