import { Fetcher } from './Fetcher.ts';
import { EXCLUDED_LANGUAGES, EXCLUDED_REPOS, USERNAME } from '../constants.js';
import { DURATIONS } from '../common/cache.js';
import { gql } from 'graphql-tag';
import { LanguagesCard } from '../components/LanguagesCard/LanguagesCard.ssr.ts';
import type { RepositoryData, TopLangData, TopLangsFetcherFields, TopLangsFetcherParams } from './types.ts';


export class TopLangsFetcher extends Fetcher implements TopLangsFetcherFields  {
	variables = { login: USERNAME };
	heading = 'Top Languages';
	layout = 'default' as TopLangsFetcherParams['layout'];
	langs_count = 10;
	exclude_langs: TopLangsFetcherFields['exclude_langs'] = [];
	exclude_repos: TopLangsFetcherFields['exclude_repos'] = [];
	size_weight;
	count_weight;
	cache_seconds;
	query = '';
	data = {};

	constructor(params: TopLangsFetcherParams) {
		super();
		this.heading = params.heading ?? 'Top Languages';
		this.layout = params.layout ?? 'default';
		this.langs_count = params.langs_count ?? 10;
		this.exclude_langs = EXCLUDED_LANGUAGES;
		this.exclude_repos = EXCLUDED_REPOS;
		this.size_weight = params.size_weight ?? 1;
		this.count_weight = params.count_weight ?? 0;
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
		this.data = this._processUserRepos(response.user.repositories.nodes);
	}

	_processUserRepos(nodes: RepositoryData[]) {
		let repoNodes;
		let repoCount = 0;

		// Filter and sort the repositories, flatten the list of language nodes, and reduce to a single object with language names as keys
		repoNodes = nodes
			.filter((node) => node.languages.edges.length > 0 && !this.exclude_repos.includes(node.name))
			.sort((a, b) => b.size - a.size)
			.reduce((acc, curr) => curr.languages.edges.concat(acc), [])
			.reduce((acc, prev) => {
				// get the size of the language (bytes)
				let langSize = prev.size;

				// FIXME I don't think this is right, the order shouldn't matter
				// if we already have the language in the accumulator
				// and the current language name is same as previous name,
				// add the size to the language size and increase repoCount.
				if (acc[prev.node.name] && prev.node.name === acc[prev.node.name].name) {
					langSize = prev.size + acc[prev.node.name].size;
					repoCount += 1;
				}
				else {
					// reset repoCount to 1
					// language must exist in at least one repo to be detected
					repoCount = 1;
				}

				return {
					...acc, [prev.node.name]: {
						name: prev.node.name,
						color: prev.node.color,
						size: langSize,
						count: repoCount,
					},
				};
			}, {});

		// comparison index calculation
		Object.keys(repoNodes).forEach((name) => {
			repoNodes[name].size = Math.pow(repoNodes[name].size, this.size_weight) * Math.pow(repoNodes[name].count, this.count_weight);
		});

		return Object.keys(repoNodes)
			.sort((a, b) => repoNodes[b].size - repoNodes[a].size)
			.filter((key => !this.exclude_langs.includes(key.toLowerCase())))
			.reduce((result, key) => {
				result = this._maybeMergeResults(['JavaScript', 'TypeScript'], key, repoNodes, result);
				result = this._maybeMergeResults(['CSS', 'SCSS'], key, repoNodes, result);

				if (!['JavaScript', 'TypeScript', 'CSS', 'SCSS'].includes(key)) {
					result[key] = repoNodes[key];
				}

				return result;
			}, {});
	}

	_maybeMergeResults(keysToMerge, key, repoNodes, result) {
		if (keysToMerge.includes(key)) {
			const newKey = keysToMerge.join('/');

			const ColourMap = {
				// Give JS/TS the JS yellow for better contrast when sitting next to PHP
				// and similar for CSS/SCSS - use SCSS's pink because it's less likely to be similar to adjacent languages
				JavaScript: repoNodes.JavaScript.color,
				TypeScript: repoNodes.JavaScript.color,
				CSS: repoNodes.SCSS.color,
				SCSS: repoNodes.SCSS.color,
			};

			if (!result[newKey]) {
				result[newKey] = {
					name: newKey, color: ColourMap[key], size: repoNodes[key].size, count: repoNodes[key].count,
				};
			}
			else {
				result[newKey].size += repoNodes[key].size;
				result[newKey].count += repoNodes[key].count;
			}
		}

		return result;
	}

	getHtml() {
		const card = new LanguagesCard();
		card.heading = this.heading;
		card.layout = this.layout;

		console.log(this.data);

		return card.toString();
	}
}