import { GlobalRegistrator } from '@happy-dom/global-registrator';
import type { CardProps } from './Card.ts';

// Register window, document, HTMLElement from HappyDOM to global scope
if (!GlobalRegistrator.isRegistered) {
	GlobalRegistrator.register();
}

// Dynamically import component *after* the globals so it picks them up correctly
await import('./Card.ts');

// Export a wrapper class that creates an instance of the custom element in the virtual DOM
// @ts-expect-error TS2420 Type "colorful" | "mono" | undefined is not assignable to type "colorful" | "mono"
export class Card implements CardProps {
	declare heading: string;
	declare description: string;
	declare icon: string;
	declare theme: CardProps['theme'];
	declare beforeContent: string;
	declare footer: string;

	constructor() {
		return window.document.createElement('x-card') as unknown as Card;
	}
}
