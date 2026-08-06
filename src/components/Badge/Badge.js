import { BaseElement } from '../BaseElement.js';
import { css } from '../utils.js';
import { SVG_NAMESPACE } from '../../constants.js';
import { icons } from '../../common/icons.js';

export class Badge extends BaseElement {
	static get observedAttributes() {
		return ['icon', 'label', 'color', 'testId'];
	}

	getCss() {
		return css`
            /* Note: Host works for shadow DOM, root works for SSR */
			:host, :root {
                font-family: "Segoe UI", system-ui, sans-serif;
                --body-color: #767486;
            }
			
			.badge {
				display: flex;
				flex-wrap: nowrap;
				align-items: center;
				gap: 0.25rem;
			}
			
			.badge__icon {
                width: 0.8rem;
                height: 0.8rem;
				transform: translateY(1px);
				
				.icon-circle {
					transform: scale(0.8);
					transform-origin: center;
				}
			}
			
			.badge__label {
                font-size: 0.85rem;
				color: var(--body-color);
			}
		`;
	}

	get icon() {
		return this.getAttribute('icon') || '';
	}

	set icon(value) {
		this.setAttribute('icon', value);
	}

	get color() {
		return this.getAttribute('color') || '#858585';
	}

	set color(value) {
		this.setAttribute('color', value);
	}

	get iconSvg() {
		return this.getAttribute('icon') !== '' ? icons[this.getAttribute('icon') ?? 'contribs'] : '';
	}

	get label() {
		return this.getAttribute('label') || '';
	}

	set label(value) {
		this.setAttribute('label', value);
	}

	get testId() {
		return this.getAttribute('testId') || '';
	}

	set testId(value) {
		this.setAttribute('testId', value);
	}

	compile() {
		const doc = this.localDocument;
		if (!doc) {
			return '';
		}

		const wrapper = doc.createElement('span');
		wrapper.setAttribute('data-testid', this.testId);

		// Add the CSS inside to ensure it renders correctly when rendered from the backend
		const style = doc.createElement('style');
		style.textContent = this.getCss();
		wrapper.appendChild(style);

		const content = doc.createElement('span');
		content.classList.add('badge');
		content.innerHTML = `
			<svg xmlns="${SVG_NAMESPACE}" class="badge__icon" viewBox="0 0 16 16" fill="${this.color}">
				${this.iconSvg}
			</svg>
			<span class="badge__label">${this.label}</span>
		`;

		wrapper.appendChild(content);

		this.innerHTML = '';
		this.appendChild(wrapper);

		return wrapper;
	}
}

if (typeof window !== 'undefined' && 'customElements' in window && !window.customElements.get('x-badge')) {
	window.customElements.define('x-badge', Badge);
}
