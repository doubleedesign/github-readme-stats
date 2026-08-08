import { BaseLanguageGroupElement, type LanguageGroupComponentProps } from '../BaseLanguageGroupElement.ts';
import { type LanguageSegment } from '../types.ts';
import { SVG_NAMESPACE } from '../../constants.js';

export type PieProps = LanguageGroupComponentProps & {
	chartWidth?: number;
};

export class LanguagePie extends BaseLanguageGroupElement {
	static get observedAttributes() {
		return ['segments', 'chartWidth'];
	}

	get chartWidth() {
		return parseInt(this.getAttribute('chartWidth') || '100', 10);
	}

	set chartWidth(value: number) {
		this.setAttribute('chartWidth', value.toString());
	}

	/**
     * Create the SVG paths for the language pie chart.
     * @param {number} cx Pie center x-position.
     * @param {number} cy Pie center y-position.
     * @param {number} radius Pie arc Radius.
     *
     * @returns {{name: string, path: string, percent: number}[]}  Array of language names + data to use for SVG path elements
     */
	createPaths(cx: number, cy: number, radius: number): { name: string; path: string; percent: number; }[] {
		const paths: { name: string; path: string; percent: number; }[] = [];
		let startAngle = 0;
		let endAngle = 0;

		const parsedSegments = this.parseSegments();

		parsedSegments.forEach((segment: LanguageSegment) => {
			endAngle = 3.6 * segment.size + startAngle;
			const startPoint = this.polarToCartesian(cx, cy, radius, endAngle - 90); // rotate donut 90 degrees counter-clockwise.
			const endPoint = this.polarToCartesian(cx, cy, radius, startAngle - 90); // rotate donut 90 degrees counter-clockwise.
			const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

			paths.push({
				name: segment.name,
				percent: segment.size,
				path: `M ${cx} ${cy} L ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 0 ${endPoint.x} ${endPoint.y} Z`
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
		const radius = this.chartWidth / 2;
		const langPaths = this.createPaths(centerX, centerY, radius);

		if(segments.length === 1) {
			const color = this.getColor(segments[0]!.name);

			return `
				<svg width="${this.chartWidth}" height="${this.chartWidth}">
					<circle data-testid="lang-slice" 
						cx="${centerX}" 
						cy="${centerY}" 
						r="${radius}" 
						fill="${color}"
					/>
				</svg>
			`;
		}

		return langPaths.map((segment, index) => {
			const color = this.getColor(segment.name);

			return `
				<path
					data-testid="lang-slice"
					d="${segment.path}"
					fill="${color}"
					stroke="#fff"
					stroke-width="2px"
					stroke-opacity="0.5"
				/>
			`;
		}).join('');
	}


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

if (typeof window !== 'undefined' && 'customElements' in window && !window.customElements.get('x-pie')) {
	window.customElements.define('x-pie', LanguagePie);
}