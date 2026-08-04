export type CommonOptions = {
};

export type RepoCardOptions = CommonOptions & {
  show_owner: boolean;
};

export type GistCardOptions = RepoCardOptions;

export type TopLangOptions = CommonOptions & {
  hide: string[];
  layout: "default" | "compact" | "donut" | "donut-vertical" | "pie";
  heading: string;
  langs_count: number;
  stats_format: "percentages" | "bytes";
};