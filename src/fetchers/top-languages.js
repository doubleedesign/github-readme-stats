// @ts-check
import { retryer } from "../common/retryer.js";
import { CustomError, MissingParamError } from "../common/error.js";
import { request } from "../common/http.js";
import { gql } from 'graphql-tag';


/**
 * Top languages GraphQL query.
 *
 * @param {any} variables Fetcher variables.
 * @param {string} token GitHub token.
 * @returns {Promise<import("axios").AxiosResponse>} Languages fetcher response.
 */
const fetcher = (variables, token) => {
	return request(
		{
			query: gql(`
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
			`).loc.source.body,
			variables,
		},
		{
			Authorization: `token ${token}`,
		},
	);
};

/**
 * @typedef {import("./types").TopLangData} TopLangData Top languages data.
 */

/**
 * @params {Partial<import("./types").TopLangOptions>}
 * @returns {Promise<TopLangData>} Top languages data.
 */
const fetchTopLanguages = async ({
     username,
     exclude_repos = [],
     exclude_langs = [],
     size_weight = 1,
     count_weight = 0,
}) => {
	if (!username) {
		throw new MissingParamError(["username"]);
	}

	const res = await retryer(fetcher, { login: username });

	if (res.data.errors) {
		console.error(res.data.errors);
		if (res.data.errors[0].type === "NOT_FOUND") {
			throw new CustomError(res.data.errors[0].message || "Could not fetch user.", CustomError.USER_NOT_FOUND);
		}
		if (res.data.errors[0].message) {
			throw new CustomError(res.data.errors[0].message, res.statusText);
		}
		throw new CustomError("Something went wrong while trying to retrieve the language data using the GraphQL API.", CustomError.GRAPHQL_ERROR);
	}

	let repoCount = 0;
	let repoNodes = res.data.data.user.repositories.nodes;

	// Filter and sort the repositories, flatten the list of language nodes, and reduce to a single object with language names as keys
	repoNodes = repoNodes
		.filter((node) => node.languages.edges.length > 0 && !exclude_repos.includes(node))
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
			} else {
				// reset repoCount to 1
				// language must exist in at least one repo to be detected
				repoCount = 1;
			}
			return {
				...acc, [prev.node.name]: {
					name: prev.node.name, color: prev.node.color, size: langSize, count: repoCount,
				},
			};
		}, {});

	// comparison index calculation
	Object.keys(repoNodes).forEach((name) => {
		repoNodes[name].size = Math.pow(repoNodes[name].size, size_weight) * Math.pow(repoNodes[name].count, count_weight);
	});

	return Object.keys(repoNodes)
		.sort((a, b) => repoNodes[b].size - repoNodes[a].size)
		.filter((key => !exclude_langs.includes(key)))
		.reduce((result, key) => {
			result = maybeMergeResults(["JavaScript", "TypeScript"], key, repoNodes, result);
			result = maybeMergeResults(["CSS", "SCSS"], key, repoNodes, result);

			if (!["JavaScript", "TypeScript", "CSS", "SCSS"].includes(key)) {
				result[key] = repoNodes[key];
			}

			return result;
		}, {});
};


function maybeMergeResults(keysToMerge, key, repoNodes, result) {
	if (keysToMerge.includes(key)) {
		const newKey = keysToMerge.join("/");

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
		} else {
			result[newKey].size += repoNodes[key].size;
			result[newKey].count += repoNodes[key].count;
		}
	}

	return result;
}

export { fetchTopLanguages };
export default fetchTopLanguages;
