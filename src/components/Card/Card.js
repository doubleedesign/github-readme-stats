import { icons } from "../../common/icons.js";
import { css } from "../utils.js";
import { SVG_NAMESPACE } from "../../constants.js";
import { BaseElement } from "../BaseElement.js";

export class Card extends BaseElement {
	static get observedAttributes() {
		return ["heading", "description", "width", "height", "icon", "beforeContent", "footer", "theme"];
	}

	getCss() {
		return css`
			/* Note: Host works for shadow DOM, root works for SSR */

			:host, :root {
				font-family: "Segoe UI", system-ui, sans-serif;
				--background-color: rgb(220 220 240 / 0.05);
				--border-color: rgb(100 100 100 / 0.3);
				--heading-color: ${this.theme === "colorful" ? "#845ec2" : "#767486"};
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

			.card__before-content {
				width: 100%;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
			}

			.card__title {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-block-end: 0.5rem;

				.card__title__icon {
					width: 1rem;
					height: 1rem;

					path {
						fill: var(--body-color);
					}
				}

				.card__title__label {
					font-size: 1rem;
					font-weight: 600;
					color: var(--heading-color);
					transform: translateY(-2px);
				}
			}

			.card__description {
				font-size: 0.85rem;
				/** Truncate text to 2 lines with ellipsis */
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.card__footer {
				width: 100%;
				margin-block-start: auto;
				padding-block-start: 0.5rem;
				box-sizing: content-box;
				display: flex;
				gap: 1rem;
			}
		`;
	}

	get theme() {
		return this.getAttribute("theme") || "colorful";
	}

	set theme(value) {
		this.setAttribute("theme", value);
	}

	get beforeContent() {
		return this.getAttribute("beforeContent") || "";
	}

	set beforeContent(value) {
		this.setAttribute("beforeContent", value);
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
		return this.getAttribute("width") || "420";
	}

	set width(value) {
		this.setAttribute("width", value);
	}

	get height() {
		return this.getAttribute("height") || "140"; // SVG viewbox doesn't support auto height
	}

	set height(value) {
		this.setAttribute("height", value);
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
			<span class="card__title" data-testid="card__title">
				<svg xmlns="${SVG_NAMESPACE}" class="card__title__icon" viewBox="0 0 16 16">
					${this.prefixIcon}
				</svg>
				<span class="card__title__label">${this.heading}</span>
			</span>
		`
			: "";
	}

	renderDescription() {
		return `<span id="card-description" class="card__description">${this.description}</span>`;
	}

	renderBeforeContent() {
		const content = this.getAttribute("beforeContent");
		return content ? `<div class="card__before-content">${content}</div>` : "";
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
		content.classList.add("card");
		content.innerHTML = `
			${this.renderBeforeContent()}
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
