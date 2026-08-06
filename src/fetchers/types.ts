export type FetcherFields = {
	variables: Record<string, any>;
	query: string;
	data: any;
	icon?: string;
	cache_seconds?: number;
};

// Values that can be passed intoto the TopLangsFetcher constructor
export type TopLangsFetcherParams = {
	layout: 'default' | 'compact' | 'donut' | 'donut-vertical' | 'pie';
	heading?: string;
	langs_count?: number;
	size_weight?: 0 | 0.5 | 1;
	count_weight?: 0 | 0.5 | 1;
};

// All fields of the TopLangsFetcher class
export type TopLangsFetcherFields = FetcherFields & TopLangsFetcherParams & {
	exclude_langs: string[];
	exclude_repos: string[];
	data: TopLangData;
};


export type GistData = {
	name: string;
	description: string | null;
	language: string | null;
	starsCount: number;
	forksCount: number;
};

export type RepositoryData = {
	name: string;
	isPrivate: boolean;
	isArchived: boolean;
	isTemplate: boolean;
	stargazers: { totalCount: number };
	description: string;
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

export type Lang = {
	name: string;
	color: string;
	size: number;
};

export type TopLangData = Record<string, Lang>;