// @ts-check
import { LanguagesCard } from "../components/LanguagesCard/LanguagesCard.ssr.js";

/**
 * Renders card to display the user's most used programming languages
 * based on a custom GraphQL query response from the GitHub API.
 *
 * @param {import("../Ffetchers/types").TopLangData} data The query response.
 * @param {Partial<import("./types").TopLangOptions>} options Display options.
 * @returns {string} Language card SVG markup for display.
 */
const renderTopLanguages = (data, options = {}) => {
	const { layout, heading = 'Top Languages', langs_count = 10 } = options;

	const card = new LanguagesCard();
	card.heading = heading;
	card.layout = layout;

	return card.toString();
};

export { renderTopLanguages };
