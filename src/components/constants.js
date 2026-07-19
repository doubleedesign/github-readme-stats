export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// Default excluded languages for badges, language bar, etc.
export const EXCLUDED_LANGUAGES = ["mdx", "shell", "blade", "hack"];

export function css(strings, ...values) {
	return String.raw({ raw: strings }, ...values);
}