import { BaseLanguageGroupElement, type LanguageGroupComponentProps } from '../BaseLanguageGroupElement.ts';
import type { LanguageSegment } from '../types.ts';
import { css } from '../utils.ts';

export type LanguageBarProps = LanguageGroupComponentProps & {
	strokeWidth?: number;
};

export class LanguageBar extends BaseLanguageGroupElement {

	getCss() {
		return css`
            /* Note: Host works for shadow DOM, root works for SSR */
            :host, :root {
                font-family: "Segoe UI", system-ui, sans-serif;
            }
			
			.language-bar {
				display: flex;
				height: ${this.strokeWidth}px;
			}
			
			.language-bar__segment {
				display: inline-block;
				height: 100%;
            }
		`;
	}

	get strokeWidth() {
		return parseInt(this.getAttribute('strokeWidth') || '4', 10);
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
			element.title = `${segment.name}: ${segment.size}%`;
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