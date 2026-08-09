import { BaseElement } from '../BaseElement.ts';
import { css } from '../utils.ts';
import { SVG_NAMESPACE } from '../../constants.js';
import { TopLangsLayout } from '../types.ts';
import '../LanguageBar/LanguageBar.ts';
import '../LanguageDonut/LanguageDonut.ts';
import '../LanguagePie/LanguagePie.ts';
import '../LanguageList/LanguageList.ts';
import '../LanguageBarChart/LanguageBarChart.ts';

export type LanguagesCardProps = {
	heading: string;
	layout?: TopLangsLayout;
	/**
	 * Stringified array of LanguageSegment[]
	 * @see {import('./types').LanguageSegment}
	 **/
	segments?: string;
};

export class LanguagesCard extends BaseElement {
	static get observedAttributes() {
		return ['heading', 'layout', 'segments'];
	}

	getCss() {
		return css`
			/* Note: Host works for shadow DOM, root works for SSR */

			:host, :root {
				font-family: "Segoe UI", system-ui, sans-serif;
				--background-color: rgb(220 220 240 / 0.05);
				--border-color: rgb(100 100 100 / 0.3);
				--heading-color: #767486;
				--body-color: #767486;
			}

			.card {
				border: 1px solid var(--border-color);
				border-radius: 0.25rem;
				background-color: var(--background-color);
				width: ${this.width}px;
				max-width: 100%;
				height: ${this.height}px;
				box-sizing: border-box;
				padding: 1rem 1.5rem;
				position: relative;
				margin: 0;
			}

			.card__title {
				font-size: 1rem;
				font-weight: 600;
				color: var(--heading-color);
                /** Truncate text to 1 line with ellipsis */
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
			}
			
			.card__chart {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				margin-block-start: 1rem;
				align-items: center;
			}
			
			x-barchart {
				display: block;
				width: 100%;
                margin-block-start: 0.5rem;
			}
			
			x-langbar {
				display: block;
				margin-block-start: 0.5rem;
				margin-block-end: 0.75rem;
			}

            x-donut,
            x-pie {
                display: block;
                margin-inline: auto;
				line-height: 0;
            }
		`;
	}

	get heading() {
		return this.getAttribute('heading') || '';
	}

	set heading(value) {
		this.setAttribute('heading', value);
	}

	get layout() {
		return this.getAttribute('layout') as TopLangsLayout || TopLangsLayout.COMPACT;
	}

	set layout(value: TopLangsLayout) {
		this.setAttribute('layout', value);
	}

	get segments() {
		return JSON.parse(this.getAttribute('segments') || '[]');
	}

	set segments(value) {
		(typeof value !== 'string') ? this.setAttribute('segments', JSON.stringify(value)) : this.setAttribute('segments', value);
	}

	get width() {
		return 300;
	}

	get height() {
		if(this.layout === TopLangsLayout.DONUT || this.layout === TopLangsLayout.PIE) {
			// Approximation of the list height based on LanguageList's hardcoded values
			const textHeight = this.segments.length * 20;
			const chartHeight = 120;
			const finalGraphicHeight = Math.max(textHeight, chartHeight) + 8;

			const cardPadding = 36;
			const contentHeight = finalGraphicHeight + cardPadding;

			return this.heading !== '' ? contentHeight + 32 : contentHeight;
		}

		if(this.layout === TopLangsLayout.BAR) {
			// Approximation of bar chart height
			const chartHeight = (this.segments.length * 32);
			const cardPadding = 36;
			const contentHeight = chartHeight + cardPadding;

			return this.heading !== '' ? contentHeight + 32 : contentHeight;
		}

		// Default = Compact layout
		// Approximation of the list height based on LanguageList's hardcoded values
		const textHeight = Math.ceil((this.segments.length / 2)) * 16;
		const barHeight = 8 + 20;
		const cardPadding = 36;
		const contentHeight = textHeight + barHeight + cardPadding;

		return this.heading !== '' ? contentHeight + 32 : contentHeight;
	}

	renderTitle() {
		const shouldShowTitle = this.getAttribute('heading') !== null && this.getAttribute('heading') !== '';

		return shouldShowTitle ? `
			<figcaption class="card__title" data-testid="card__title">
				${this.heading}
			</figcaption>
		` : '';
	}

	renderSegments() {
		if(this.segments.length < 1) return;

		if(this.layout === TopLangsLayout.DONUT) {
			return `
				<div class="card__chart">
					<x-list segments='${JSON.stringify(this.segments)}' layout="narrow"></x-list>
					<x-donut segments='${JSON.stringify(this.segments)}' chartWidth="120"></x-donut>
				</div>
			`;
		}

		if(this.layout === TopLangsLayout.PIE) {
			return `
				<div class="card__chart">
					<x-list segments='${JSON.stringify(this.segments)}' layout="narrow"></x-list>
					<x-pie segments='${JSON.stringify(this.segments)}' chartWidth="120"></x-pie>
				</div>
			`;
		}

		if(this.layout === TopLangsLayout.BAR) {
			return `
				<x-barchart segments='${JSON.stringify(this.segments)}'></x-barchart>
			`;
		}

		// Default = Compact layout
		return `
			<x-langbar segments='${JSON.stringify(this.segments)}' strokeWidth="8"></x-langbar>
			<x-list segments='${JSON.stringify(this.segments)}' layout="wide"></x-list>
		`;
	}

	compile() {
		const doc = this.localDocument;
		if (!doc) {
			return null;
		}

		const wrapper = doc.createElementNS(SVG_NAMESPACE, 'svg');
		wrapper.setAttribute('xmlns', SVG_NAMESPACE);
		wrapper.setAttribute('width', String(this.width));
		wrapper.setAttribute('height', String(this.height));
		wrapper.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);

		// Add the CSS inside the SVG to ensure it renders correctly when rendered from the backend
		const style = doc.createElementNS(SVG_NAMESPACE, 'style');
		style.textContent = this.getCss();
		wrapper.appendChild(style);

		const titleTag = doc.createElementNS(SVG_NAMESPACE, 'title');
		titleTag.textContent = this.heading;
		wrapper.appendChild(titleTag);

		// Create an inner wrapper that allows non-SVG HTML content
		// Note: Must use SVG namespace here because foreignObject is case-sensitive
		const innerWrapper = doc.createElementNS(SVG_NAMESPACE, 'foreignObject');
		innerWrapper.setAttribute('width', String(this.width));
		innerWrapper.setAttribute('height', String(this.height));

		// Put the content inside a normal HTML fragment so we can use things like flexbox layout
		const content = doc.createElement('figure');
		content.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
		content.classList.add('card');
		content.innerHTML = `
			${this.renderTitle()}
			${this.renderSegments()}
		`;

		innerWrapper.appendChild(content);
		wrapper.appendChild(innerWrapper);

		this.innerHTML = '';
		this.appendChild(wrapper);

		return wrapper;
	}
}

if (typeof window !== 'undefined' && 'customElements' in window && !window.customElements.get('x-languages')) {
	window.customElements.define('x-languages', LanguagesCard);
}
