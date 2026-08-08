// @ts-expect-error TS7016: Could not find a declaration file for module emoji-name-map.
import toEmoji from 'emoji-name-map';

/**
 * Process template literal containing CSS.
 * Allows for syntax highlighting in the web component source code
 * while also injecting the CSS as a string in the final output.
 */
export function css(strings: any, ...values: any[]) {
	return String.raw({ raw: strings }, ...values);
}

/**
 * Retrieves num with suffix k(thousands) precise to given decimal places.
 *
 * @param {number} num The number to format.
 * @param {number=} precision The number of decimal places to include.
 * @returns {string|number} The formatted number.
 */
export function kFormatter(num: number, precision?: number): string {
	const abs = Math.abs(num);
	const sign = Math.sign(num);

	if (typeof precision === 'number' && !isNaN(precision)) {
		return (sign * (abs / 1000)).toFixed(precision) + 'k';
	}

	if (abs < 1000) {
		return (sign * abs).toString();
	}

	return sign * parseFloat((abs / 1000).toFixed(1)) + 'k';
}

/**
 * Parse emoji from string.
 *
 * @param {string} str String to parse emojis from.
 * @returns {string} String with emojis parsed.
 */
export function parseEmojis(str: string): string {
	if (!str) {
		throw new Error('[parseEmoji]: str argument not provided');
	}

	return str.replace(/:\w+:/gm, (emoji) => {
		return toEmoji.get(emoji) || '';
	});
}
