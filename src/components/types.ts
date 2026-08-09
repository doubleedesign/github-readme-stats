export type LanguageSegment = {
	name: string;
	size: number;
};

export enum TopLangsLayout {
	BAR = 'bar',
	COMPACT = 'compact',
	DONUT = 'donut',
	PIE = 'pie',
}

export type Coordinates = {
	x: number;
	y: number;
};