import { Card } from '../components/Card/Card.ssr.ts';
import { Badge } from '../components/Badge/Badge.ts';
import { LanguageBar } from '../components/LanguageBar/LanguageBar.ts';
import { EXCLUDED_LANGUAGES } from '../constants.js';
import { kFormatter, parseEmojis, getLanguageColor } from '../components/utils.ts';
import { icons } from '../common/icons.js';
import type { RepositoryData, GistData, CardData } from '../fetchers/types.ts';

export class CardFactory {

	static _languageBar(languages: CardData['languages']['edges']) {
		if (!languages || languages.length === 0 || !Array.isArray(languages)) {
			return '';
		}

		const bar = new LanguageBar();
		bar.segments = JSON.stringify(languages.map(edge => ({
			name: edge.node.name,
			size: edge.size
		})));

		return bar.toString();
	}

	static _languageBadge(primary: string|null, others: CardData['languages']['edges']) {
		if (!primary || !others || others.length === 0 || !Array.isArray(others)) {
			return '';
		}

		// Order the others by size
		others.sort((a, b) => b.size - a.size);
		const othersNames = others.map(edge => edge.node.name).filter(name => name !== primary && !EXCLUDED_LANGUAGES.includes(name.toLowerCase()));
		let allNames = [primary, ...othersNames];

		if (EXCLUDED_LANGUAGES.includes(primary.toLowerCase())) {
			primary = others.length > 0 ? (allNames[0] ?? null) : null;
			allNames = allNames.slice(1);
		}

		// If JS/TS or CSS/SCSS are both present, prefer the one there is more of if the difference is substantial
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
			const cssLarger = cssSize > scssSize * 1.5;
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
			label += `, ${nextTwo.join(', ')}`;
			if (allNames.length > 2) {
				label += ` +${allNames.length - 2}`;
			}
		}

		const badge = new Badge();
		badge.icon = 'circle';
		badge.label = label ?? '';
		badge.color = getLanguageColor(allNames[0]);
		badge.testId = 'languages';

		return badge.toString();
	}

	static _starsBadge(count: number) {
		const badge = new Badge();
		badge.icon = 'star';
		badge.label = kFormatter(count);
		badge.testId = 'stargazers';

		return badge.toString();
	}

	static _forksBadge(count: number) {
		const badge = new Badge();
		badge.icon = 'fork';
		badge.label = kFormatter(count);
		badge.testId = 'forkcount';

		return badge.toString();
	}

	static generateCardHtml(icon: keyof typeof icons, data: RepositoryData|GistData) {
		const { name, description, primaryLanguage, languages, starCount, forkCount } = data;

		let footerHtml = this._languageBadge(primaryLanguage?.name, languages?.edges);

		if (starCount > 0) {
			footerHtml += this._starsBadge(starCount);
		}

		if (forkCount > 0) {
			footerHtml += this._forksBadge(forkCount);
		}

		const card = new Card();
		card.beforeContent = languages?.edges ? this._languageBar(languages.edges) : '';
		card.heading = name;
		card.description = parseEmojis(description || 'No description provided');
		card.icon = icon;
		card.footer = footerHtml;

		return card.toString();
	}
}