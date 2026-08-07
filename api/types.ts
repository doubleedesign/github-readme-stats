import type { TopLangsFetcherParams } from '../src/fetchers/types.ts';

export type TopLangsQueryOptions = TopLangsFetcherParams;

export type GistQueryOptions = {
	id: string;
};

export type RepoQueryOptions = {
	repo: string;
};