// A safe reference to HTMLElement that won't throw in the Node environment
const DomBaseElement = (typeof window !== 'undefined' ? window.HTMLElement : Object) as typeof HTMLElement;

/**
 * An "abstract" class that provides cross-environment support and common methods for custom web components.
 */
export class BaseElement extends DomBaseElement {
	connectedCallback() {
		// Only hook up Shadow DOM in the browser, and only if it hasn't already been attached (had some double rendering issues, dunno why)
		if (typeof window !== 'undefined' && this.ownerDocument === window.document && !this.shadowRoot) {
			this.attachShadow({ mode: 'open' });
			this.render();
			if (this.firstChild) {
				// @ts-expect-error TS2531: Object is possibly null
				this.shadowRoot.appendChild(this.firstChild);
			}
		}
		else {
			// Server-side (Happy DOM / Node)
			this.render();
		}
	}

	attributeChangedCallback(name: any, oldValue: any, newValue: any) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	// Get correct document environment - Node or browser
	get localDocument() {
		return this.ownerDocument || (typeof document !== 'undefined' ? document : null);
	}

	compile(): SVGSVGElement | HTMLElement | null {
		// This method should be overridden by subclasses to provide the actual rendering logic and return a string.
		return null;
	}

	render(): SVGSVGElement | HTMLElement | null {
		return this?.compile();
	}

	toString(): string {
		return this?.compile()?.outerHTML?.trim() ?? '';
	}
}