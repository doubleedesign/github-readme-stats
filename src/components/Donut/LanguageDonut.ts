import { BaseLanguageGroupElement, type LanguageGroupComponentProps } from '../BaseLanguageGroupElement.ts';
import { type LanguageSegment } from '../types.ts';
import { SVG_NAMESPACE } from '../../constants.js';

export type DonutProps = LanguageGroupComponentProps & {
	chartWidth?: number;
	strokeWidth?: number;
};

export class LanguageDonut extends BaseLanguageGroupElement {
	static get observedAttributes() {
		return ['segments', 'chartWidth', 'strokeWidth'];
	}

	get chartWidth() {
		return parseInt(this.getAttribute('width') || '100', 10);
	}

	set chartWidth(value: number) {
		this.setAttribute('width', value.toString());
	}

	get strokeWidth() {
		return parseInt(this.getAttribute('strokeWidth') || '12', 10);
	}

	set strokeWidth(value: number) {
		this.setAttribute('strokeWidth', value.toString());
	}

	degreesToRadians(angleInDegrees: number) {
		return angleInDegrees * (Math.PI / 180.0);
	}

	/**
	 * Convert polar coordinates to Cartesian coordinates.
	 * @param {number} centerX Center x coordinate.
	 * @param {number} centerY Center y coordinate.
	 * @param {number} radius Radius of the circle.
	 * @param {number} angleInDegrees Angle in degrees.
	 *
	 * @returns {{x: number, y: number}} Cartesian coordinates.
	 */
	polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): { x: number; y: number; } {
		const rads = this.degreesToRadians(angleInDegrees);

		return {
			x: centerX + radius * Math.cos(rads),
			y: centerY + radius * Math.sin(rads),
		};
	};

	/**
	 * Create the SVG paths for the language donut chart.
	 * @param {number} cx Donut center x-position.
	 * @param {number} cy Donut center y-position.
	 * @param {number} radius Donut arc Radius.
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
				path: `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 0 ${endPoint.x} ${endPoint.y}`
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
		const langPaths = this.createPaths(centerX, centerY, radius);

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
