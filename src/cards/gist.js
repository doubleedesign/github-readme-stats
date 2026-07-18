// @ts-check

import {
	flexLayout,
	iconWithLabel,
	createLanguageNode,
} from "../common/render.js";
import { kFormatter } from "../common/fmt.js";
import { icons } from "../common/icons.js";
import { parseEmojis } from "../common/ops.js";
import { createRequire } from "module";
import { Card } from "../components/ssr.js";

const require = createRequire(import.meta.url);
const languageColors = require("../common/languageColors.json");

/**
 * Render gist card.
 *
 * @param {GistData} gistData Gist data.
 * @param {Partial<GistCardOptions>} options Gist card options.
 * @returns {string} Gist card.
 */
export const renderGistCard = (gistData, options = {}) => {
	const { name, nameWithOwner, description, language, starsCount, forksCount } =
		gistData;

	const langName = language || "Unspecified";
	const langColor = languageColors[langName] || "#858585";
	const svgLanguage = createLanguageNode(langName, langColor);

	const totalStars = kFormatter(starsCount);
	const totalForks = kFormatter(forksCount);
	const svgStars = iconWithLabel(icons.star, totalStars, "starsCount");
	const svgForks = iconWithLabel(icons.fork, totalForks, "forksCount");

	const footer = flexLayout({
		items: [svgLanguage, svgStars, svgForks],
		gap: 25,
	}).join("");

	const card = new Card();
	card.heading = options.show_owner ? nameWithOwner : name;
	card.description = parseEmojis(description || "No description provided");
	card.colorMode = options.colorMode ?? "light";
	card.icon = "gist";
	card.footer = footer;

	return card.toString().trim();
};
