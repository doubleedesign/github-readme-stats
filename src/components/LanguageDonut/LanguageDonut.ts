import { BaseLanguageGroupElement, type LanguageGroupComponentProps } from '../BaseLanguageGroupElement.ts';
import type { LanguageSegment, Coordinates } from '../types.ts';
import { SVG_NAMESPACE } from '../../constants.js';
import { Path } from '../../factories/Path.ts';

export type DonutProps = LanguageGroupComponentProps & {
	chartWidth?: number;
	strokeWidth?: number;
};

export class LanguageDonut extends BaseLanguageGroupElement {
	static get observedAttributes() {
		return ['segments', 'chartWidth', 'strokeWidth'];
	}

	get chartWidth() {
		return parseInt(this.getAttribute('chartWidth') || '100', 10);
	}

	set chartWidth(value: number) {
		this.setAttribute('chartWidth', value.toString());
	}

	get strokeWidth() {
		return parseInt(this.getAttribute('strokeWidth') || '12', 10);
	}

	set strokeWidth(value: number) {
		this.setAttribute('strokeWidth', value.toString());
	}

	/**
	 * Create the SVG paths for the language donut chart.
	 * @param {Coordinates} center Donut center coordinates.
	 * @param {number} radius Donut arc Radius.
	 *
	 * @returns {{name: string, path: string, percent: number}[]}  Array of language names + data to use for SVG path elements
	 */
	createPaths(center: Coordinates, radius: number): { name: string; path: string; percent: number; }[] {
		const paths: { name: string; path: string; percent: number; }[] = [];
		let startAngle = 0;
		let endAngle = 0;

		const parsedSegments = this.parseSegments();

		parsedSegments.forEach((segment: LanguageSegment) => {
			endAngle = 3.6 * segment.size + startAngle;
			const startPoint = this.polarToCartesian(center, radius, endAngle - 90); // rotate to put the first slice at 12 o'clock position
			const endPoint = this.polarToCartesian(center, radius, startAngle - 90); // rotate to put the first slice at 12 o'clock position
			const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

			paths.push({
				name: segment.name,
				percent: segment.size,
				path: new Path(segment.name)
					.from(startPoint)
					.arcTo(radius, radius, 0, largeArcFlag, 0, endPoint)
					.toString()
			});

			startAngle = endAngle;
		});

		return paths;
	};

	generatePathHtml() {
		const segments = this.parseSegments();
		if (segments.length === 0) {
			return null;
		}

		const centerX = this.chartWidth / 2;
		const centerY = this.chartWidth / 2;
		const radius = centerX - this.strokeWidth;

		if(segments.length === 1) {
			const color = this.getColor(segments[0]!.name);

			return `
				<svg width="${this.chartWidth}" height="${this.chartWidth}">
					<circle data-testid="lang-donut" 
						cx="${centerX}" 
						cy="${centerY}" 
						r="${radius}" 
						stroke="${color}"
						fill="none" 
						stroke-width="${this.strokeWidth}" 
						size="100"
					/>
				</svg>
			`;
		}

		const langPaths = this.createPaths({ x: centerX, y: centerY }, radius);

		return langPaths.map((segment, index) => {
			const color = this.getColor(segment.name);

			return `
				<path
					data-testid="lang-donut"
					size="${segment.percent}"
					d="${segment.path}"
					stroke="${color}"
					fill="none"
					stroke-width="${this.strokeWidth}">
				</path>
			`;
		}).join('');
	};

	compile() {
		const doc = this.localDocument;
		if (!doc) {
			return null;
		}

		const wrapper = doc.createElementNS(SVG_NAMESPACE, 'svg');
		wrapper.setAttribute('xmlns', SVG_NAMESPACE);
		wrapper.setAttribute('width', String(this.chartWidth));
		wrapper.setAttribute('height', String(this.chartWidth));
		wrapper.setAttribute('viewBox', `0 0 ${this.chartWidth} ${this.chartWidth}`);

		wrapper.innerHTML += this.generatePathHtml() || '';

		this.innerHTML = '';
		this.appendChild(wrapper);

		return wrapper;
	}
}

if (typeof window !== 'undefined' && 'customElements' in window && !window.customElements.get('x-donut')) {
	window.customElements.define('x-donut', LanguageDonut);
}
