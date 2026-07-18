type RankIcon = "default" | "github" | "percentile";

export type CommonOptions = {
  locale: string;
};

export type StatCardOptions = CommonOptions & {
  hide: string[];
  show_icons: boolean;
  hide_title: boolean;
  card_width: number;
  hide_rank: boolean;
  include_all_commits: boolean;
  commits_year: number;
  custom_title: string;
  disable_animations: boolean;
  number_format: string;
  number_precision: number;
  ring_color: string;
  rank_icon: RankIcon;
  show: string[];
};

export type RepoCardOptions = CommonOptions & {
  show_owner: boolean;
  description_lines_count: number;
};

export type TopLangOptions = CommonOptions & {
  hide_title: boolean;
  card_width: number;
  hide: string[];
  layout: "compact" | "normal" | "donut" | "donut-vertical" | "pie";
  custom_title: string;
  langs_count: number;
  disable_animations: boolean;
  hide_progress: boolean;
  stats_format: "percentages" | "bytes";
};

export type GistCardOptions = CommonOptions & {
  show_owner: boolean;
};
