export type LanguageSegment = {
	name: string;
	size: number;
};

export enum TopLangsLayout {
	DEFAULT = 'default',
	COMPACT = 'compact',
	DONUT = 'donut',
	DONUT_VERTICAL = 'donut-vertical',
	PIE = 'pie',
}