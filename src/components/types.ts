export type LanguageSegment = {
	name: string;
	size: number;
};

export enum TopLangsLayout {
	DEFAULT = 'default',
	COMPACT = 'compact',
	DONUT = 'donut',
	PIE = 'pie',
}

export type Coordinates = {
	x: number;
	y: number;
};