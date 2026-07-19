// A safe reference to HTMLElement that won't throw in the Node environment
const DomBaseElement = typeof window !== "undefined" ? window.HTMLElement : Object;

/**
 * An "abstract" class that provides cross-environment support and common methods for custom web components.
 */
export class BaseElement extends DomBaseElement {

	connectedCallback() {
		// Only hook up Shadow DOM in the browser
		if (typeof window !== "undefined" && this.ownerDocument === window.document) {
			this.attachShadow({ mode: "open" });
			this.render();
			if (this.firstChild) {
				this.shadowRoot.appendChild(this.firstChild);
			}
		} else {
			// Server-side (Happy DOM / Node)
			this.render();
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	// Get correct document environment - Node or browser
	get localDocument() {
		return this.ownerDocument || (typeof document !== "undefined" ? document : null);
	}

	compile() {
		// This method should be overridden by subclasses to provide the actual rendering logic and return a string.
		return null;
	}

	render() {
		return this?.compile();
	}

	toString() {
		return this?.compile()?.outerHTML?.trim() ?? "";
	}
}