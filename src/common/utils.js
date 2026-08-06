// @ts-check

/**
 * Encode string as HTML.
 *
 * @see https://stackoverflow.com/a/48073476/10629172
 *
 * @param {string} str String to encode.
 * @returns {string} Encoded string.
 */
const encodeHTML = (str) => {
  return str
    .replace(/[\u00A0-\u9999<>&](?!#)/gim, (i) => {
      return "&#" + i.charCodeAt(0) + ";";
    })
    .replace(/\u0008/gim, "");
};




/**
 * Convert bytes to a human-readable string representation.
 *
 * @param {number} bytes The number of bytes to convert.
 * @returns {string} The human-readable representation of bytes.
 * @throws {Error} If bytes is negative or too large.
 */
const formatBytes = (bytes) => {
	if (bytes < 0) {
		throw new Error("Bytes must be a non-negative number");
	}

	if (bytes === 0) {
		return "0 B";
	}

	const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
	const base = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(base));

	if (i >= sizes.length) {
		throw new Error("Bytes is too large to convert to a human-readable string");
	}

	return `${(bytes / Math.pow(base, i)).toFixed(1)} ${sizes[i]}`;
};



export {
  encodeHTML,
  formatBytes
};
