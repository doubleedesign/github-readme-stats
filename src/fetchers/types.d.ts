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
		}
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