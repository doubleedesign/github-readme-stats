export type FetcherFields = {
	variables: Record<string, any>;
	query: string;
	data: any;
	icon?: string;
	cache_seconds?: number;
};

export enum LanguageRankingAlgorithm {
	BYTE_COUNT = 'byte_count',
	REPO_COUNT = 'repo_count',
	BOTH = 'both',
}

// Values that can be passed into the TopLangsFetcher constructor
export type TopLangsFetcherParams = {
	layout?: 'default' | 'compact' | 'donut' | 'donut-vertical' | 'pie';
	heading?: string;
	langs_count?: number;
	algorithm?: LanguageRankingAlgorithm;
};

// All fields of the TopLangsFetcher class
export type TopLangsFetcherFields = FetcherFields & TopLangsFetcherParams & {
	exclude_langs: string[];
	exclude_repos: string[];
	data: TopLangData;
};

export type GistFetcherFields = FetcherFields & {
	variables: {
		gistName: string;
	}
};

export type RepoFetcherFields = FetcherFields & {
	variables: {
		login: string;
		repo: string;
	};
	icon: string;
};

export type CardData = {
	name: string;
	description: string | null;
	language: string | null;
	primaryLanguage: {
		color: string;
		name: string;
	};
	languages: {
		edges: {
			size: number;
			node: {
				color: string;
				name: string;
			}
		}[]
	}
	forkCount: number;
	starCount: number;
};


export type GistData = CardData & {
};

export type RepositoryData = CardData & {
	isPrivate: boolean;
	isArchived: boolean;
	isTemplate: boolean;
	stargazers: { totalCount: number };
};

export type Lang = {
	name: string;
	color: string;
	size: number;
};

export type LangData = {
	/** Byte count across all repos */
	bytes: number;
	/** Number of repos containing the language */
	count: number;
	/** Weighted size based on the size_weight and count_weight parameters */
	size: number;
};

/**
 * Language name + counts.
 */
export type TopLangData = Record<string, LangData>;