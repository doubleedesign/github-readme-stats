import { Fetcher } from "./Fetcher.js";
import { Card } from "../components/Card/Card.ssr.js";
import { DURATIONS } from "../common/cache.js";
import { gql } from "graphql-tag";
import { get_forks_badge_html, get_language_badge_html, get_stars_badge_html } from "../common/badges.js";
import { parseEmojis } from "../common/ops.js";

export class GistFetcher extends Fetcher {
	constructor(gistId) {
		super();
		this.variables.gistName = gistId;
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

		const data = result.viewer.gist;

		this.data = {
			name: data.files[Object.keys(data.files)[0]].name,
			description: data.description,
			language: this._getPrimaryLanguage(data.files),
			starCount: data.stargazerCount,
			forkCount: data.forks.totalCount,
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

		return primaryLanguage;
	}

	getHtml() {
		const { name, description, language, starCount, forkCount } = this.data;
		let footerHtml = get_language_badge_html(language, []);

		if (starCount > 0) {
			footerHtml += get_stars_badge_html(starCount);
		}

		if (forkCount > 0) {
			footerHtml +=  get_forks_badge_html(forkCount);
		}

		const card = new Card();
		card.heading = name;
		card.description = parseEmojis(description || "No description provided");
		card.icon = "gist";
		card.footer = footerHtml;

		return card.toString();
	}
}