import { Card } from '../components/Card/Card.ssr.ts';


export enum SECONDARY_ERROR_MESSAGE {
	MAX_RETRY = 'Too many requests',
	// eslint-disable-next-line max-len
	NO_TOKENS = 'Local: Please add an env variable called GITHUB_TOKEN in your .env file and add your GitHub Personal Access token there. Prod (Vercel): Please add an env variable called PAT_1 with your GitHub token in Vercel.',
	USER_NOT_FOUND = 'Make sure the provided username is not an organization',
	GRAPHQL_ERROR = 'GraphQL API error. Please check your GitHub token\'s permissions and ensure it has access to the required data.',
	GITHUB_REST_API_ERROR = 'GitHub REST API error. Please check your GitHub token\'s permissions and ensure it has access to the required data.',
	ACCESS_DENIED = 'Please deploy your own instance',
}

/**
 * Custom error class to handle custom GRS errors.
 */
export class CustomError extends Error {
	type: string;
	secondaryMessage: SECONDARY_ERROR_MESSAGE;

	/**
     * Custom error constructor.
     *
     * @param {string} message Error message.
     * @param {string} type Error type.
     */
	constructor(message: string, type?: string) {
		super(message);
		this.type = type ?? 'UNKNOWN_ERROR';
		this.secondaryMessage = SECONDARY_ERROR_MESSAGE[type as keyof typeof SECONDARY_ERROR_MESSAGE];
	}
}

/**
 * Retrieve secondary message from an error object.
 *
 * @param {Error} err The error object.
 * @returns {string|undefined} The secondary message if available, otherwise undefined.
 */
export const retrieveSecondaryMessage = (err: Error): string | undefined => {
	return 'secondaryMessage' in err && typeof err.secondaryMessage === 'string'
		? err.secondaryMessage
		: undefined;
};


/**
 * Renders error message on the card.
 *
 * @param {object} args Function arguments.
 * @param {string} args.message Main error message.
 * @param {SECONDARY_ERROR_MESSAGE} args.secondaryMessage The secondary error message.
 * @returns {string} The SVG markup.
 */
export const renderError = ({ message, secondaryMessage }: { message: string, secondaryMessage: SECONDARY_ERROR_MESSAGE }): string => {
	const card = new Card();
	card.heading = message;
	card.description = secondaryMessage;
	card.icon = 'issues';
	card.theme = 'mono';

	return card.toString();
};