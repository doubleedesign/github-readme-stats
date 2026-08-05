export type CommonOptions = {
};

export type RepoCardOptions = CommonOptions & {
  show_owner: boolean;
};

export type GistCardOptions = RepoCardOptions;

export type TopLangOptions = CommonOptions & {
  layout: "default" | "compact" | "donut" | "donut-vertical" | "pie";
  heading: string;
  langs_count: number;
};

export type TopLangQueryOptions = {
  exclude_langs: string[];
  exclude_repos: string[];
}