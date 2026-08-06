import { Window } from 'happy-dom';

// Initialise virtual DOM
const virtualWindow = new Window();
globalThis.window = virtualWindow;
globalThis.document = virtualWindow.document;
globalThis.HTMLElement = virtualWindow.HTMLElement;

// Dynamically import component *after* the globals so it picks them up correctly
await import('./LanguagesCard.js');

// Export a wrapper class that creates an instance of the custom element in the virtual DOM
export class LanguagesCard {
	constructor() {
		return window.document.createElement('x-languages');
	}
}
