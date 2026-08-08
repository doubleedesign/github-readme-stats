import { BaseElement } from './BaseElement.ts';
import type { LanguageSegment } from './types.ts';
import { EXCLUDED_LANGUAGES, LANGUAGE_COLORS } from '../constants.js';

export type LanguageGroupComponentProps = {
	/**
	 * Stringified array of LanguageSegment[]
	 * @see {import('./types').LanguageSegment}
	 **/
	segments: string;
};

/**
 * Superclass for components that render a group of languages as some sort of chart graphic.
 * Intended to be treated as an abstract class containing common logic, and not used directly.
 */
export class BaseLanguageGroupElement extends BaseElement {
	static get observedAttributes() {
		return ['segments'];
	}

	get segments() {
		return this.getAttribute('segments') || '';
	}

	set segments(value) {
		this.setAttribute('segments', value);
	}

	/**
	 * Parse the segments attribute and return an array of LanguageSegment objects with their sizes normalized to percentages.
	 * @returns {LanguageSegment[]} Array of LanguageSegment objects with normalized sizes.
	 */
	parseSegments(): LanguageSegment[] {
		const segmentsAttr = this.getAttribute('segments');
		if (!segmentsAttr) {
			return [];
		}

		const data = JSON.parse(segmentsAttr);
		const refinedData = data.filter((segment: LanguageSegment) => !EXCLUDED_LANGUAGES.includes(segment.name.toLowerCase()));
		const totalSize = refinedData.reduce((sum: number, segment: LanguageSegment) => sum + segment.size, 0);

		return refinedData.map((segment: LanguageSegment) => ({
			name: segment.name,
			size: Number((segment.size / totalSize) * 100).toFixed(2)
		}));
	}

	getColor(language: string) {
		// @ts-expect-error TS7053: Element implicitly has an any type
		return LANGUAGE_COLORS[language] || '#858585';
	}
}