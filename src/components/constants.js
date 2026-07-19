export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export function css(strings, ...values) {
	return String.raw({ raw: strings }, ...values);
}