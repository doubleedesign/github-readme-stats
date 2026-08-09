import { BaseLanguageGroupElement, type LanguageGroupComponentProps } from '../BaseLanguageGroupElement.ts';
import type { LanguageSegment } from '../types.ts';
import { css } from '../utils.ts';

export type LanguageListProps = LanguageGroupComponentProps & {
	layout: 'narrow' | 'wide';
};

export class LanguageList extends BaseLanguageGroupElement {
	static get observedAttributes() {
		return ['segments', 'layout'];
	}

	get layout() {
		return this.getAttribute('layout') || 'narrow';
	}

	set layout(value: string) {
		this.setAttribute('layout', value);
	}

	getCss() {
		return css`
            /* Note: Host works for shadow DOM, root works for SSR */
            :host, :root {
                font-family: "Segoe UI", system-ui, sans-serif;
                --body-color: #767486;
            }
			
			.language-list {
				margin: 0;
				padding: 0;
				max-width: 300px;
                display: ${this.layout === 'wide' ? 'grid' : 'flex'};
				grid-template-columns: repeat(2, 1fr);
				flex-direction: column;
				gap: 0.25rem;
				grid-gap: 0.5rem;
			}
			
			.language-list__item {
				font-size: 0.75rem;
				color: var(--body-color);
				display: flex;
				align-items: center;
				gap: 0.25rem;
				line-height: 1;
			}

            .language-list__item__indicator {
				height: 0.5rem;
				width: 0.5rem;
				display: inline-block;
				border-radius: 50%;
			}
		`;
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
		wrapper.setAttribute('data-testid', 'language-list');

		// Add the CSS inside to ensure it renders correctly when rendered from the backend
		const style = doc.createElement('style');
		style.textContent = this.getCss();
		wrapper.appendChild(style);

		const innerWrapper = doc.createElement('ul');
		innerWrapper.classList.add('language-list');

		segments.forEach((segment: LanguageSegment)  => {
			const dot = doc.createElement('span');
			dot.classList.add('language-list__item__indicator');
			dot.style.backgroundColor = `${this.getColor(segment.name)}`;

			const text = doc.createElement('span');
			text.classList.add('language-list__item__label');
			text.innerHTML = `${segment.name}: ${segment.size}%`;

			const element = doc.createElement('li');
			element.className = 'language-list__item';
			element.appendChild(dot);
			element.appendChild(text);

			innerWrapper.appendChild(element);
		});

		wrapper.appendChild(innerWrapper);

		this.innerHTML = '';
		this.appendChild(wrapper);

		return wrapper;
	}
}


if (typeof window !== 'undefined' && 'customElements' in window && !window.customElements.get('x-list')) {
	window.customElements.define('x-list', LanguageList);
}