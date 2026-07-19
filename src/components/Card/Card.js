import { icons } from "../../common/icons.js";
import { SVG_NAMESPACE, css } from "../constants.js";
import { BaseElement } from "../BaseElement.js";

export class Card extends BaseElement {
	static get observedAttributes() {
		return ["heading", "description", "width", "height", "colorMode", "icon", "footer"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	getCss() {
		return css`
			@keyframes scaleInAnimation {
				from {
					transform: translate(-5px, 5px) scale(0);
				}
				to {
					transform: translate(-5px, 5px) scale(1);
				}
			}
			@keyframes fadeInAnimation {
				from {
					opacity: 0;
				}
				to {
					opacity: 1;
				}
			}

			.card {
				--background-color: #fffefe;
				--border-color: #e4e2e2;
				--heading-color: #845ec2;
				--body-color: #434d58;

				display: inline-block;
				border: 1px solid var(--border-color);
				background-color: var(--background-color);
				width: ${this.width}px;
				max-width: 100%;
				height: ${this.height}px;
				box-sizing: border-box;
				padding: 1rem 1.5rem;
			}

			.card[data-color-mode="dark"] {
				--border-color: #434d58;
				--background-color: #1e1e1e;
			}

			text,
			span {
				font-family: "Segoe UI", system-ui, sans-serif;
				display: block;
				color: var(--body-color);
				line-height: 1.4;
			}

			.card-title {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-block-end: 0.5rem;

				.card-title__icon {
					width: 1rem;
					height: 1rem;

					path {
						fill: var(--body-color);
					}
				}
				.card-title__label {
					font-size: 1rem;
					font-weight: 600;
					color: var(--heading-color);
					transform: translateY(-2px);
				}
			}

			.card__description {
				font-size: 0.85rem;
			}
			
			.card__footer {
				width: 100%;
				margin-block-start: 1rem;
			}
		`;
	}

	get heading() {
		return this.getAttribute("heading") || "";
	}

	set heading(value) {
		this.setAttribute("heading", value);
	}

	get description() {
		return this.getAttribute("description") || "";
	}

	set description(value) {
		this.setAttribute("description", value);
	}

	get width() {
		return this.getAttribute("width") || "400";
	}

	set width(value) {
		this.setAttribute("width", value);
	}

	get height() {
		return this.getAttribute("height") || "125"; // SVG viewbox doesn't support auto height
	}

	set height(value) {
		this.setAttribute("height", value);
	}

	get colorMode() {
		return this.getAttribute("colorMode") || "light";
	}

	set colorMode(value) {
		this.setAttribute("colorMode", value);
	}

	get icon() {
		return this.getAttribute("icon") ?? "";
	}

	set icon(name) {
		this.setAttribute("icon", name);
	}

	get footer() {
		return this.getAttribute("footer") || "";
	}

	set footer(value) {
		this.setAttribute("footer", value);
	}

	get prefixIcon() {
		return this.getAttribute("icon") !== "" ? icons[this.getAttribute("icon") ?? "contribs"] : "";
	}

	get isTemplate() {
		return this.getAttribute("isTemplate") === "true";
	}

	set isTemplate(value) {
		this.setAttribute("isTemplate", value);
	}

	get isArchived() {
		return this.getAttribute("isArchived") === "true";
	}

	set isArchived(value) {
		this.setAttribute("isArchived", value);
	}

	renderTitle() {
		const shouldShowTitle = this.getAttribute("heading") !== null && this.getAttribute("heading") !== "";

		return shouldShowTitle
			? `
			<span class="card-title" data-testid="card-title">
				<svg xmlns="${SVG_NAMESPACE}" class="card-title__icon" viewBox="0 0 16 16">
					${this.prefixIcon}
				</svg>
				<span class="card-title__label">${this.heading}</span>
			</span>
		`
			: "";
	}

	renderDescription() {
		return `<span id="card-description" class="card__description">${this.description}</span>`;
	}

	renderFooter() {
		const content = this.getAttribute("footer");
		return content ? `<div class="card__footer">${content}</div>` : "";
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
		wrapper.setAttribute("aria-describedby", "card-description");

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
		content.setAttribute("data-color-mode", this.getAttribute("colorMode") || "light");
		content.classList.add("card");
		content.innerHTML = `
			${this.renderTitle()}
			${this.renderDescription()}
			${this.renderFooter()}
		`;

		innerWrapper.appendChild(content);
		wrapper.appendChild(innerWrapper);

		this.innerHTML = "";
		this.appendChild(wrapper);

		return wrapper;
	}

}

if (typeof window !== "undefined" && "customElements" in window && !window.customElements.get("x-card")) {
	window.customElements.define("x-card", Card);
}
