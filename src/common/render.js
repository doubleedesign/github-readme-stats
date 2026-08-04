// @ts-check

import { SECONDARY_ERROR_MESSAGES, TRY_AGAIN_LATER } from "./error.js";
import { encodeHTML } from "./utils.js";

// Script parameters.
const ERROR_CARD_LENGTH = 576.5;

const UPSTREAM_API_ERRORS = [
  TRY_AGAIN_LATER,
  SECONDARY_ERROR_MESSAGES.MAX_RETRY,
];

/**
 * Renders error message on the card.
 *
 * @param {object} args Function arguments.
 * @param {string} args.message Main error message.
 * @param {string} [args.secondaryMessage=""] The secondary error message.
 * @param {object} [args.renderOptions={}] Render options.
 * @returns {string} The SVG markup.
 */
const renderError = ({
  message,
  secondaryMessage = "",
  renderOptions = {},
}) => {
  const {
    show_repo_link = true,
  } = renderOptions;

  return `
    <svg width="${ERROR_CARD_LENGTH}"  height="120" viewBox="0 0 ${ERROR_CARD_LENGTH} 120"  xmlns="http://www.w3.org/2000/svg">
  
    <rect x="0.5" y="0.5" width="${
      ERROR_CARD_LENGTH - 1
    }" height="99%" rx="4.5"/>
    <text x="25" y="45" class="text">Something went wrong!${
      UPSTREAM_API_ERRORS.includes(secondaryMessage) || !show_repo_link
        ? ""
        : " file an issue at https://tiny.one/readme-stats"
    }</text>
    <text data-testid="message" x="25" y="55" class="text small">
      <tspan x="25" dy="18">${typeof message === 'string' ? encodeHTML(message) : ""}</tspan>
      <tspan x="25" dy="18" class="gray">${secondaryMessage}</tspan>
    </text>
    </svg>
  `;
};

export {
  ERROR_CARD_LENGTH,
  renderError
};
