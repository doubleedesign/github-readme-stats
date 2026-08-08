import { GlobalRegistrator } from '@happy-dom/global-registrator';
import type { LanguagesCardProps } from './LanguagesCard.ts';
import { TopLangsLayout } from '../types.ts';

// Register window, document, HTMLElement from HappyDOM to global scope
if (!GlobalRegistrator.isRegistered) {
	GlobalRegistrator.register();
}

// Dynamically import component *after* the globals so it picks them up correctly
await import('./LanguagesCard.ts');

// Export a wrapper class that creates an instance of the custom element in the virtual DOM
export class LanguagesCard implements LanguagesCardProps {
	declare heading: string;
	declare layout: TopLangsLayout;
	/**
	 * Stringified array of LanguageSegment[]
	 * @see {import('./types').LanguageSegment}
	 **/
	declare segments: string;

	constructor() {
		return window.document.createElement('x-languages') as unknown as LanguagesCard;
	}
}
