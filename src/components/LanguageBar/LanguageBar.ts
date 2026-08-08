import { BaseElement } from '../BaseElement.ts';
import { css } from '../utils.ts';
import { EXCLUDED_LANGUAGES, LANGUAGE_COLORS } from '../../constants.js';
import type { LanguageSegment } from '../types.ts';

export type LanguageBarProps = {
	segments: string; // JSON stringified array of LanguageSegment[]
};

export class LanguageBar extends BaseElement {
	static get observedAttributes() {
		return ['segments'];
	}

	get segments() {
		return this.getAttribute('segments') || '';
	}

	set segments(value) {
		this.setAttribute('segments', value);
	}

	getCss() {
		return css`
            /* Note: Host works for shadow DOM, root works for SSR */
            :host, :root {
                font-family: "Segoe UI", system-ui, sans-serif;
            }
			
			.language-bar {
				display: flex;
				height: 0.25rem;
			}
			
			.language-bar__segment {
				display: inline-block;
				height: 100%;
            }
		`;
	}

	parseSegments() {
		const segmentsAttr = this.getAttribute('segments');
		if (!segmentsAttr) {
			return [];
		}

		const data = JSON.parse(segmentsAttr);

		const refinedData = data.filter((segment: LanguageSegment) => !EXCLUDED_LANGUAGES.includes(segment.name.toLowerCase()));

		const totalSize = refinedData.reduce((sum: number, segment: LanguageSegment) => sum + segment.size, 0);

		return refinedData.map((segment: LanguageSegment) => ({
			name: segment.name,
			size:  (segment.size / totalSize) * 100
		}));
	}

	getColor(language: string) {
		// @ts-expect-error TS7053: Element implicitly has an any type
		return LANGUAGE_COLORS[language] || '#858585';
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
		wrapper.setAttribute('data-testid', 'language-bar');

		// Add the CSS inside to ensure it renders correctly when rendered from the backend
		const style = doc.createElement('style');
		style.textContent = this.getCss();
		wrapper.appendChild(style);

		const innerWrapper = doc.createElement('div');
		innerWrapper.classList.add('language-bar');

		segments.forEach((segment: LanguageSegment)  => {
			const element = doc.createElement('span');
			element.className = 'language-bar__segment';
			element.style.width = `${segment.size}%`;
			element.style.backgroundColor = this.getColor(segment.name);
			element.title = `${segment.name}: ${segment.size.toFixed(2)}%`;
			innerWrapper.appendChild(element);
		});

		wrapper.appendChild(innerWrapper);

		this.innerHTML = '';
		this.appendChild(wrapper);

		return wrapper;
	}
}

if (typeof window !== 'undefined' && 'customElements' in window && !window.customElements.get('x-langbar')) {
	window.customElements.define('x-langbar', LanguageBar);
}