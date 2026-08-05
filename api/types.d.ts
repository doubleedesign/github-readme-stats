export type TopLangOptions = {
  layout: "default" | "compact" | "donut" | "donut-vertical" | "pie";
  heading: string;
  langs_count: number;
};

export type TopLangQueryOptions = {
  exclude_langs: string[];
  exclude_repos: string[];
}