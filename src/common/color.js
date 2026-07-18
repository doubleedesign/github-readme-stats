const themes = {
  default: {
    title_color: "#2f80ed",
    icon_color: "#4c71f2",
    text_color: "#434d58",
    bg_color: "#fffefe",
    border_color: "#e4e2e2",
    ring_color: "#0000ff",
  },
};

/**
 * Checks if a string is a valid hex color.
 *
 * @param {string} hexColor String to check.
 * @returns {boolean} True if the given string is a valid hex color.
 */
const isValidHexColor = (hexColor) => {
  return new RegExp(
    /^([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{4})$/,
  ).test(hexColor);
};

/**
 * Check if the given string is a valid gradient.
 *
 * @param {string[]} colors Array of colors.
 * @returns {boolean} True if the given string is a valid gradient.
 */
const isValidGradient = (colors) => {
  return (
    colors.length > 2 &&
    colors.slice(1).every((color) => isValidHexColor(color))
  );
};

/**
 * Retrieves a gradient if color has more than one valid hex codes else a single color.
 *
 * @param {string} color The color to parse.
 * @param {string | string[]} fallbackColor The fallback color.
 * @returns {string | string[]} The gradient or color.
 */
const fallbackColor = (color, fallbackColor) => {
  let gradient = null;

  let colors = color ? color.split(",") : [];
  if (colors.length > 1 && isValidGradient(colors)) {
    gradient = colors;
  }

  return (
    (gradient ? gradient : isValidHexColor(color) && `#${color}`) ||
    fallbackColor
  );
};

/**
 * Returns theme based colors with proper overrides and defaults.
 */
const getCardColors = ({}) => {
  return themes.default;
};

export { isValidHexColor, isValidGradient, getCardColors };
