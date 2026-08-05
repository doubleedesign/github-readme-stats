// @ts-check
import { Card } from "../components/Card/Card.ssr.js";

/**
 * @type {string} A general message to ask user to try again later.
 */
const TRY_AGAIN_LATER = "Please try again later";

/**
 * @type {Object<string, string>} A map of error types to secondary error messages.
 */
const SECONDARY_ERROR_MESSAGES = {
  MAX_RETRY:
    "You can deploy own instance or wait until public will be no longer limited",
  NO_TOKENS:
    'Local: Please add an env variable called GITHUB_TOKEN in your .env file and add your GitHub Personal Access token there. Prod: Please add an env variable called PAT_1 with your GitHub token in Vercel',
  USER_NOT_FOUND: "Make sure the provided username is not an organization",
  GRAPHQL_ERROR: TRY_AGAIN_LATER,
  GITHUB_REST_API_ERROR: TRY_AGAIN_LATER,
  ACCESS_DENIED:  "Please deploy your own instance",
};

/**
 * Custom error class to handle custom GRS errors.
 */
class CustomError extends Error {
  /**
   * Custom error constructor.
   *
   * @param {string} message Error message.
   * @param {string} type Error type.
   */
  constructor(message, type) {
    super(message);
    this.type = type;
    this.secondaryMessage = SECONDARY_ERROR_MESSAGES[type] || type;
  }

  static MAX_RETRY = "MAX_RETRY";
  static NO_TOKENS = "NO_TOKENS";
  static USER_NOT_FOUND = "USER_NOT_FOUND";
  static GRAPHQL_ERROR = "GRAPHQL_ERROR";
  static GITHUB_REST_API_ERROR = "GITHUB_REST_API_ERROR";
}

/**
 * Missing query parameter class.
 */
class MissingParamError extends Error {
  /**
   * Missing query parameter error constructor.
   *
   * @param {string[]} missedParams An array of missing parameters names.
   * @param {string=} secondaryMessage Optional secondary message to display.
   */
  constructor(missedParams, secondaryMessage) {
    const msg = `Missing params ${missedParams
      .map((p) => `"${p}"`)
      .join(", ")} make sure you pass the parameters in URL`;
    super(msg);
    this.missedParams = missedParams;
    this.secondaryMessage = secondaryMessage;
  }
}

/**
 * Retrieve secondary message from an error object.
 *
 * @param {Error} err The error object.
 * @returns {string|undefined} The secondary message if available, otherwise undefined.
 */
const retrieveSecondaryMessage = (err) => {
  return "secondaryMessage" in err && typeof err.secondaryMessage === "string"
    ? err.secondaryMessage
    : undefined;
};


/**
 * Renders error message on the card.
 *
 * @param {object} args Function arguments.
 * @param {string} args.message Main error message.
 * @param {string} [args.secondaryMessage=""] The secondary error message.
 * @returns {string} The SVG markup.
 */
const renderError = ({ message, secondaryMessage = "" }) => {
	const card = new Card();
	card.heading = message;
	card.description = secondaryMessage;
	card.icon = "issues";
	card.theme = "mono";

	return card.toString();
};

export {
  renderError,
  CustomError,
  MissingParamError,
  SECONDARY_ERROR_MESSAGES,
  TRY_AGAIN_LATER,
  retrieveSecondaryMessage,
};
