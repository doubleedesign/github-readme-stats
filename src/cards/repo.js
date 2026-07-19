// @ts-check
import { parseEmojis } from "../common/utils.js";
import { Card } from "../components/Card/Card.ssr.js";
import {
	get_language_bar_html,
	get_forks_badge_html,
	get_stars_badge_html,
	get_language_badge_html,
} from "../common/badges.js";

/**
 * Renders repository card details.
 *
 * @param {import('../fetchers/types').RepositoryData} repo Repository data.
 * @param {Partial<import("./types").RepoCardOptions>} options Card options.
 * @returns {string} Repository card SVG object.
 */
export const renderRepoCard = (repo, options = {}) => {
	const { name, nameWithOwner, description, primaryLanguage, starCount, forkCount } = repo;
	const { show_owner = false, show_stars = true, show_forks = true } = options;
	let footerHtml = get_language_badge_html(primaryLanguage?.name, repo?.languages?.edges, repo.name);

	if (show_stars && starCount > 0) {
		footerHtml += get_stars_badge_html(starCount);
	}

	if (show_forks && forkCount > 0) {
		footerHtml +=  get_forks_badge_html(forkCount);
	}

	const card = new Card();
	card.beforeContent = repo?.languages?.edges ? get_language_bar_html(repo.languages.edges) : "";
	card.heading = show_owner ? nameWithOwner : name;
	card.description = parseEmojis(description || "No description provided");
	card.colorMode = options.colorMode ?? "light";
	card.icon = "contribs";
	card.footer = footerHtml;

	return card.toString();
};