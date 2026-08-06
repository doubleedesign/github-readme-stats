import { BaseElement } from "../BaseElement.js";
import { css } from "../utils.js";
import { SVG_NAMESPACE } from "../../constants.js";

export class LanguagesCard extends BaseElement {
	static get observedAttributes() {
		return ["heading", "layout"];
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
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				border: 1px solid var(--border-color);
				border-radius: 0.25rem;
				background-color: var(--background-color);
				width: ${this.width}px;
				max-width: 100%;
				height: ${this.height}px;
				box-sizing: border-box;
				padding: 1.25rem 1.5rem 1rem;
				position: relative;
			}

			text,
			span {
				display: block;
				color: var(--body-color);
				line-height: 1.4;
			}

			.card__title {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-block-end: 0.5rem;
				font-size: 1rem;
				font-weight: 600;
				color: var(--heading-color);
			}

		`
	}

	get heading() {
		return this.getAttribute("heading") || "";
	}

	set heading(value) {
		this.setAttribute("heading", value);
	}

	get layout() {
		return this.getAttribute("layout") || "default";
	}

	set layout(value) {
		this.setAttribute("layout", value);
	}

	get width() {
		return 300;
	}

	get height() {
		return 300;
	}

	renderTitle() {
		const shouldShowTitle = this.getAttribute("heading") !== null && this.getAttribute("heading") !== "";

		return shouldShowTitle ? `
			<span class="card__title" data-testid="card__title">
				${this.heading}
			</span>
		` : "";
	}

	compile() {
		const doc = this.localDocument;
		if (!doc) {
			return "";
		}

		const wrapper = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
		wrapper.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		wrapper.setAttribute("width", this.width);
		wrapper.setAttribute("height", this.height);
		wrapper.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);

		// Add the CSS inside the SVG to ensure it renders correctly when rendered from the backend
		const style = doc.createElementNS(SVG_NAMESPACE, "style");
		style.textContent = this.getCss();
		wrapper.appendChild(style);

		const titleTag = doc.createElementNS(SVG_NAMESPACE, "title");
		titleTag.textContent = this.heading;
		wrapper.appendChild(titleTag);

		// Create an inner wrapper that allows non-SVG HTML content
		// Note: Must use SVG namespace here because foreignObject is case-sensitive
		const innerWrapper = doc.createElementNS(SVG_NAMESPACE, "foreignObject");
		innerWrapper.setAttribute("width", this.width);
		innerWrapper.setAttribute("height", this.height);

		// Put the content inside a normal HTML fragment so we can use things like flexbox layout
		const content = doc.createElement("div");
		content.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
		content.classList.add("card");
		content.innerHTML = `
			${this.renderTitle()}

		`;

		innerWrapper.appendChild(content);
		wrapper.appendChild(innerWrapper);

		this.innerHTML = "";
		this.appendChild(wrapper);

		return wrapper;
	}
}

if (typeof window !== "undefined" && "customElements" in window && !window.customElements.get("x-languages")) {
	window.customElements.define("x-languages", LanguagesCard);
}
