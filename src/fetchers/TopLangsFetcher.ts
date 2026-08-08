import { Fetcher } from './Fetcher.ts';
import { EXCLUDED_LANGUAGES, EXCLUDED_REPOS, USERNAME, LANGUAGE_COLORS } from '../constants.js';
import { DURATIONS } from '../common/cache.ts';
import { gql } from 'graphql-tag';
import { LanguagesCard } from '../components/LanguagesCard/LanguagesCard.ssr.ts';
import {
	LanguageRankingAlgorithm,
	type RepositoryData,
	type TopLangData,
	type TopLangsFetcherFields,
	type TopLangsFetcherParams,
} from './types.ts';
import type { LanguageSegment } from '../components/types.ts';
import type { LangData } from './types.ts';


export class TopLangsFetcher extends Fetcher implements TopLangsFetcherFields {
	variables = { login: USERNAME };
	heading = 'Top Languages';
	layout;
	langs_count;
	exclude_langs: TopLangsFetcherFields['exclude_langs'] = [];
	exclude_repos: TopLangsFetcherFields['exclude_repos'] = [];
	algorithm;
	cache_seconds;
	query = '';
	data: TopLangData = {};

	constructor(params: TopLangsFetcherParams) {
		super();
		this.heading = params.heading ?? 'Top Languages';
		this.layout = params.layout ?? 'default';
		this.langs_count = params.langs_count ?? 10;
		this.exclude_langs = EXCLUDED_LANGUAGES;
		this.exclude_repos = EXCLUDED_REPOS;
		this.algorithm = params.algorithm ?? LanguageRankingAlgorithm.BOTH;
		this.cache_seconds = DURATIONS.ONE_DAY;

		this.query = gql(`
			query userPublicRepos($login: String!) {
				user(login: $login) {
					repositories(
						ownerAffiliations: OWNER
						isFork: false
						first: 100
						visibility: PUBLIC
						orderBy: { field: UPDATED_AT, direction: DESC }
					) {
						nodes {
							name
							languages(first: 20, orderBy: {field: SIZE, direction: DESC}) {
								edges {
									size
									node {
										color
										name
									}
								}
							}
						}
					}
				}
			}
		`)?.loc?.source.body ?? '';
	}

	async fetch() {
		const response = await super.fetch(this.variables);
		this._processUserRepos(response.user.repositories.nodes);
		this._sort();
		this._trim();
	}

	_processUserRepos(nodes: RepositoryData[]) {
		const result: TopLangData = {};

		nodes.forEach((repo) => {
			if (this.exclude_repos.includes(repo.name)) {
				return;
			}

			repo.languages.edges.forEach((edge) => {
				const langName = edge.node.name;
				if (!langName) return;
				if (EXCLUDED_LANGUAGES.includes(langName.toLowerCase())) return;

				if (!result[langName]) {
					result[langName] = { bytes: 0, count: 0, size: 0 };
				}

				result[langName].bytes += edge.size;
				result[langName].count += 1;
			});
		});

		// Comparison index calculation - needs to happen after all byte and repo counts are done
		// Source: https://github.com/anuraghazra/github-readme-stats/commit/5577bbf07fae7f0e2fcbed24042a59e5442434dc
		let size_weight = this.algorithm === LanguageRankingAlgorithm.BYTE_COUNT ? 1 : 0;
		let count_weight = this.algorithm === LanguageRankingAlgorithm.REPO_COUNT ? 1 : 0;
		if(this.algorithm === LanguageRankingAlgorithm.BOTH) {
			size_weight = 0.5;
			count_weight = 0.5;
		}
		for (const langName in result) {
			result[langName]!.size = Math.pow(result[langName]!.bytes, size_weight) * Math.pow(result[langName]!.count, count_weight);
		}

		this.data = result;
	};

	_sort() {
		const sorted = Object.entries(this.data).sort(([, a], [, b]) => {
			return b.size - a.size;
		});

		this.data = Object.fromEntries(sorted);
	}

	_trim() {
		this.data = Object.fromEntries(Object.entries(this.data).slice(0, this.langs_count));
	}

	_maybeMergeResults(keysToMerge: string[], key: string, repoNodes: Record<string, LangData>, result: Record<string, LangData>) {
		if (keysToMerge.includes(key)) {
			const newKey = keysToMerge.join('/');

			const ColourMap = {
				// Give JS/TS the JS yellow for better contrast when sitting next to PHP
				// and similar for CSS/SCSS - use SCSS's pink because it's less likely to be similar to adjacent languages
				JavaScript: LANGUAGE_COLORS['JavaScript'],
				TypeScript: LANGUAGE_COLORS['JavaScript'],
				CSS: LANGUAGE_COLORS['SCSS'],
				SCSS: LANGUAGE_COLORS['SCSS'],
			};

			if (!result[newKey]) {
				result[newKey] = {
					// @ts-expect-error TS7053: Element implicitly has an any type
					name: newKey, color: ColourMap[key], size: repoNodes[key].size, count: repoNodes[key].count,
				};
			}
			else {
				result[newKey].size += repoNodes?.[key]?.size || 0;
				result[newKey].count += repoNodes?.[key]?.count || 1;
			}
		}

		return result;
	}

	_getPercentages(): LanguageSegment[] {
		const totalSize = Object.values(this.data).reduce((acc, lang) => acc + lang.size, 0);

		return Object.entries(this.data).map(([lang, data]) => {
			const percentage = totalSize > 0 ? (data.size / totalSize) * 100 : 0;

			return {
				name: lang,
				size: percentage
			};
		});

	}

	getHtml() {
		const card = new LanguagesCard();
		card.heading = this.heading;
		card.layout = this.layout as LanguagesCard['layout'];
		card.segments = JSON.stringify(this._getPercentages());

		return card.toString();
	}
}