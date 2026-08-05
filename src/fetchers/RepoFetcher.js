import { Fetcher } from "./Fetcher.js";
import { Card } from "../components/Card/Card.ssr.js";
import { CustomError } from "../common/error.js";
import { gql } from "graphql-tag";
import {
	get_forks_badge_html,
	get_language_badge_html,
	get_language_bar_html,
	get_stars_badge_html,
} from "../common/badges.js";
import { parseEmojis } from "../common/ops.js";
import { DURATIONS } from "../common/cache.js";
import { USERNAME } from "../constants.js";

export class RepoFetcher extends Fetcher {
	constructor(repo) {
		super();
		this.variables.login = USERNAME;
		this.variables.repo = repo;
		this.cache_seconds = DURATIONS.TEN_DAY;

		this.query = gql(`
            query getRepo($login: String!, $repo: String!) {
                user(login: $login) {
                    repository(name: $repo) {
                        name
                        isPrivate
                        isArchived
                        isTemplate
                        forkCount
                        stargazers {
                            totalCount
                        }
                        description
                        primaryLanguage {
                            color
                            name
                        }
                        languages(first: 10) {
                            edges {
                                size
                                node {
                                    name
                                    color
                                }
                            }
                        }
                    }
                }
            }
		`).loc.source.body;
	}

	async fetch() {
		const data = await super.fetch(this.variables);

		if (!data.user) {
			throw new Error("User not found for repository query");
		}


		if (!data.user.repository || data.user.repository.isPrivate) {
			throw new CustomError("Repository not found", `The repository <em>${this.variables.repo}</em> could not be found. It may be private, or may not exist at all.`);
		}

		this.data = {
			...data.user.repository,
			starCount: data.user.repository.stargazers.totalCount,
		}
	}

	getHtml() {
		const { name, description, primaryLanguage, languages, starCount, forkCount } = this.data;

		let footerHtml = get_language_badge_html(primaryLanguage?.name, languages?.edges, name);

		if (starCount > 0) {
			footerHtml += get_stars_badge_html(starCount);
		}

		if (forkCount > 0) {
			footerHtml +=  get_forks_badge_html(forkCount);
		}

		const card = new Card();
		card.beforeContent = languages?.edges ? get_language_bar_html(languages.edges) : "";
		card.heading = name;
		card.description = parseEmojis(description || "No description provided");
		card.icon = "contribs";
		card.footer = footerHtml;

		return card.toString();
	}
}