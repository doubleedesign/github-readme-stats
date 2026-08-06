import { Fetcher } from "./Fetcher.js";
import { CustomError } from "../common/error.js";
import { gql } from "graphql-tag";
import { DURATIONS } from "../common/cache.js";
import { USERNAME } from "../constants.js";

export class RepoFetcher extends Fetcher {
	constructor(repo) {
		super();
		this.variables.login = USERNAME;
		this.variables.repo = repo;
		this.icon = "contribs";
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
}