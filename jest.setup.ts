import '@testing-library/jest-dom';
import { Card as CardComponent } from './src/components/Card/Card.ts';
import { LanguagesCard as LanguagesCardComponent } from './src/components/LanguagesCard/LanguagesCard.ts';

// Bypass the SSR wrappers and use the client-side web components they wrap in tests.
// This is to get around the top-level await used in the SSR wrappers.
jest.mock('./src/components/Card/Card.ssr.ts', () => {
	return { Card: CardComponent };
});
jest.mock('./src/components/LanguagesCard/LanguagesCard.ssr.ts', () => {
	return { LanguagesCard: LanguagesCardComponent };
});