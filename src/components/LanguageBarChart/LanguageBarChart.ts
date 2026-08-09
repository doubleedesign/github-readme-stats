import { BaseLanguageGroupElement, type LanguageGroupComponentProps } from '../BaseLanguageGroupElement.ts';
import type { LanguageSegment } from '../types.ts';
import { css } from '../utils.ts';

export type BarChartProps = LanguageGroupComponentProps & {
	strokeWidth?: number;
};

export class LanguageBarChart extends BaseLanguageGroupElement {
	static get observedAttributes() {
		return ['segments', 'strokeWidth'];
	}

	getCss() {
		return css`
            /* Note: Host works for shadow DOM, root works for SSR */
            :host, :root {
                font-family: "Segoe UI", system-ui, sans-serif;
                --body-color: #767486;
            }
			
			.language-bar-chart {
				width: 100%;
				margin: 0;
				padding: 0;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}
			
			.language-bar-chart__item {
				font-size: 0.75rem;
				color: var(--body-color);
				display: flex;
				flex-direction: column;
				gap: 0.25rem;
			}

            .language-bar-chart__item__indicator {
				height: ${this.strokeWidth}px;
				display: inline-block;
			}

            .language-bar-chart__item__label {
				line-height: 1;
			}
		`;
	}

	get strokeWidth() {
		return parseInt(this.getAttribute('strokeWidth') || '8', 10);
	}

	set strokeWidth(value: number) {
		this.setAttribute('strokeWidth', value.toString());
	}

	compile() {
		const doc = this.localDocument;
		if (!doc) {
			return null;
		}
		const segments = this.parseSegments();
		if (segments.length === 0) {
			return null;
		}

		const wrapper = doc.createElement('div');
		wrapper.setAttribute('data-testid', 'language-bar-chart');

		// Add the CSS inside to ensure it renders correctly when rendered from the backend
		const style = doc.createElement('style');
		style.textContent = this.getCss();
		wrapper.appendChild(style);

		const innerWrapper = doc.createElement('ul');
		innerWrapper.classList.add('language-bar-chart');

		segments.forEach((segment: LanguageSegment)  => {
			const bar = doc.createElement('span');
			bar.classList.add('language-bar-chart__item__indicator');
			bar.style.backgroundColor = `${this.getColor(segment.name)}`;
			bar.style.width = `${segment.size}%`;

			const text = doc.createElement('span');
			text.classList.add('language-bar-chart__item__label');
			text.innerHTML = `${segment.name}: ${segment.size}%`;

			const element = doc.createElement('li');
			element.className = 'language-bar-chart__item';
			element.appendChild(bar);
			element.appendChild(text);

			innerWrapper.appendChild(element);
		});

		wrapper.appendChild(innerWrapper);

		this.innerHTML = '';
		this.appendChild(wrapper);

		return wrapper;
	}
}

if (typeof window !== 'undefined' && 'customElements' in window && !window.customElements.get('x-barchart')) {
	window.customElements.define('x-barchart', LanguageBarChart);
}
