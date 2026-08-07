import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Register window, document, HTMLElement from HappyDOM to global scope
if (!GlobalRegistrator.isRegistered) {
	GlobalRegistrator.register();
}

// Dynamically import component *after* the globals so it picks them up correctly
await import('./Card.js');

// Export a wrapper class that creates an instance of the custom element in the virtual DOM
export class Card {
	declare heading: string;
	declare description: string;
	declare icon: string;
	declare theme: string;
    
	constructor() {
		return window.document.createElement('x-card') as unknown as Card;
	}
}
