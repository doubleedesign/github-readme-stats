import { Badge } from "../components/Badge/Badge.js";
import { LanguageBar } from "../components/LanguageBar/LanguageBar.js";
import languageColors from "../common/languageColors.json" with { type: "json" };
import { EXCLUDED_LANGUAGES } from "../components/constants.js";
import { kFormatter } from "./utils.js";

export const get_language_bar_html = (languages) => {
	if (!languages || languages.length === 0 || !Array.isArray(languages)) {
		return "";
	}

	const bar = new LanguageBar();
	bar.segments = JSON.stringify(languages.map(edge => ({
		name: edge.node.name,
		size: edge.size
	})));

	return bar.toString();
}

export function get_language_badge_html(primary, others, repo = "") {
	if (!primary) {
		return "";
	}

	// Order the others by size
	others.sort((a, b) => b.size - a.size);
	const othersNames = others.map(edge => edge.node.name).filter(name => name !== primary && !EXCLUDED_LANGUAGES.includes(name.toLowerCase()));
	let allNames = [primary, ...othersNames];

	if (EXCLUDED_LANGUAGES.includes(primary.toLowerCase())) {
		primary = others.length > 0 ? allNames[0] : null;
		allNames = allNames.slice(1);
	}

	// If JS/TS or CSS/SCSS are both present, prefer the one there is more of if the difference is substantial (or a specific repo override)
	if (allNames.includes('JavaScript') && allNames.includes('TypeScript')) {
		const jsSize = others.find(lang => lang.node.name === 'JavaScript')?.size || 0;
		const tsSize = others.find(lang => lang.node.name === 'TypeScript')?.size || 0;
		const jsLarger = jsSize > tsSize * 1.5;
		if(!jsLarger) {
			const jsIndex = allNames.indexOf('JavaScript');
			allNames[jsIndex] = 'TypeScript';
		}
		else {
			const tsIndex = allNames.indexOf('TypeScript');
			allNames[tsIndex] = 'JavaScript';
		}
	}
	if (allNames.includes('CSS') && allNames.includes('SCSS')) {
		const cssSize = others.find(lang => lang.node.name === 'CSS')?.size || 0;
		const scssSize = others.find(lang => lang.node.name === 'SCSS')?.size || 0;
		const cssLarger = cssSize > scssSize * 1.5 && !['comet-components'].includes(repo);
		if (!cssLarger) {
			const cssIndex = allNames.indexOf('CSS');
			allNames[cssIndex] = 'SCSS';
		}
		else {
			const scssIndex = allNames.indexOf('SCSS');
			allNames[scssIndex] = 'CSS';
		}
	}

	// Ensure we haven't created duplicates when doing the replacements above, and ensure no excluded languages are included
	allNames = [...new Set(allNames)].filter(name => !EXCLUDED_LANGUAGES.includes(name.toLowerCase()));

	let label = allNames[0];
	if(allNames.length > 1) {
		const nextTwo = allNames.slice(1, 3);
		label += `, ${nextTwo.join(", ")}`;
		if (allNames.length > 2) {
			label += ` +${allNames.length - 2}`;
		}
	}

	const badge = new Badge();
	badge.icon = "circle";
	badge.label = label;
	badge.color = languageColors[allNames[0]] || "#858585";
	badge.testId = "languages";

	return badge.toString();
}

export function get_stars_badge_html(count) {
	const badge = new Badge();
	badge.icon = "star";
	badge.label = kFormatter(count);
	badge.testId = "stargazers";

	return badge.toString();
}

export function get_forks_badge_html(count) {
	const badge = new Badge();
	badge.icon = "fork";
	badge.label = kFormatter(count);
	badge.testId = "forkcount";

	return badge.toString();
}