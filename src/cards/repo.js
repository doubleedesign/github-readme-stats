// @ts-check
import { icons } from "../common/icons.js";
import { flexLayout, kFormatter, measureText, parseEmojis } from "../common/utils.js";
import { Card } from "../components/ssr.js";
import { iconWithLabel } from "../common/render.js";

/**
 * Creates a node to display the primary programming language of the repository.
 *
 * @param {string} langName Language name.
 * @param {string} langColor Language color.
 * @returns {string} Language display SVG object.
 */
const createLanguageNode = (langName, langColor) => {
	return `
  <g data-testid="primary-lang">
    <circle data-testid="lang-color" cx="0" cy="-5" r="6" fill="${langColor}" />
    <text data-testid="lang-name" class="gray" x="15">${langName}</text>
  </g>
  `;
};

/**
 * Renders repository card details.
 *
 * @param {import('../fetchers/types').RepositoryData} repo Repository data.
 * @param {Partial<import("./types").RepoCardOptions>} options Card options.
 * @returns {string} Repository card SVG object.
 */
export const renderRepoCard = (repo, options = {}) => {
	const { name, nameWithOwner, description, primaryLanguage, starCount, forkCount } = repo;
	const { show_owner = false } = options;

	const langName = (primaryLanguage && primaryLanguage.name) || "Unspecified";
	const langColor = (primaryLanguage && primaryLanguage.color) || "#333";
	const svgLanguage = primaryLanguage ? createLanguageNode(langName, langColor) : "";

	const totalStars = kFormatter(starCount);
	const totalForks = kFormatter(forkCount);
	const svgStars = iconWithLabel(icons.star, totalStars, "stargazers");
	const svgForks = iconWithLabel(icons.fork, totalForks, "forkcount");

	const footer = flexLayout({
		items: [svgLanguage, svgStars, svgForks],
		gap: 25,
	}).join("");

	const card = new Card();
	card.heading = show_owner ? nameWithOwner : name;
	card.description = parseEmojis(description || "No description provided");
	card.colorMode = options.colorMode ?? "light";
	card.icon = "contribs";
	card.footer = footer;

	return card.toString().trim();
};