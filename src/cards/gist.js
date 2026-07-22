// @ts-check
import { parseEmojis } from "../common/ops.js";
import { Card } from "../components/Card/Card.ssr.js";
import { get_forks_badge_html, get_stars_badge_html, get_language_badge_html } from "../common/badges.js";

/**
 * Render gist card.
 *
 * @param {GistData} gistData Gist data.
 * @param {Partial<GistCardOptions>} options Gist card options.
 * @returns {string} Gist card.
 */
export const renderGistCard = (gistData, options = {}) => {
	const { name, nameWithOwner, description, language, starCount, forkCount } = gistData;
	const { show_stars = true, show_forks = true } = options;
	let footerHtml = get_language_badge_html(language, []);

	if (show_stars && starCount > 0) {
		footerHtml += get_stars_badge_html(starCount);
	}

	if (show_forks && forkCount > 0) {
		footerHtml +=  get_forks_badge_html(forkCount);
	}

	const card = new Card();
	card.heading = options.show_owner ? nameWithOwner : name;
	card.description = parseEmojis(description || "No description provided");
	card.color_mode = options.color_mode ?? "light";
	card.icon = "gist";
	card.footer = footerHtml;

	return card.toString();
};
