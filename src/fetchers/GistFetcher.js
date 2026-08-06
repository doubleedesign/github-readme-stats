import { Fetcher } from "./Fetcher.ts";
import { DURATIONS } from "../common/cache.js";
import { gql } from "graphql-tag";
import { LANGUAGE_COLORS } from "../constants.js";

export class GistFetcher extends Fetcher {
	constructor(gistId) {
		super();
		this.variables.gistName = gistId;
		this.icon = "gist";
		this.cache_seconds = DURATIONS.TEN_DAY;

		this.query = gql(`
            query gistInfo($gistName: String!) {
                viewer {
                    gist(name: $gistName) {
                        description
                        owner {
                            login
                        }
                        stargazerCount
                        forks {
                            totalCount
                        }
                        files {
                            name
                            language {
                                name
                            }
                            size
                        }
                    }
                }
            }
		`).loc.source.body;
	}
	
	async fetch() {
		const result = await super.fetch(this.variables);
		if (!result.viewer.gist) {
			throw new Error("Gist not found");
		}

		const { description, files, stargazerCount, forks } = result.viewer.gist;

		this.data = {
			name: files[Object.keys(files)[0]].name,
			description,
			primaryLanguage: this._getPrimaryLanguage(files),
			languages: this._formatLanguages(files),
			starCount: stargazerCount,
			forkCount: forks.totalCount,
		};
	}

	// Put the languages into the same format as a repository query result
	_formatLanguages(files) {
		return {
			edges: files.map(file => ({
				size: file.size,
				node: {
					name: file.language ? file.language.name : "Unknown",
					color: LANGUAGE_COLORS[file.language ? file.language.name : "Unknown"] || "#858585",
				}
			}))
		};
	}

	_getPrimaryLanguage(files) {
		const languages = {};
		for (const file of files) {
			if (file.language) {
				if (languages[file.language.name]) {
					languages[file.language.name] += file.size;
				} else {
					languages[file.language.name] = file.size;
				}
			}
		}

		let primaryLanguage = Object.keys(languages)[0];
		for (const language in languages) {
			if (languages[language] > languages[primaryLanguage]) {
				primaryLanguage = language;
			}
		}

		return languages[primaryLanguage] ? { name: primaryLanguage } : null;
	}
}