import { renderError } from "./utils.js";
import { MissingParamError, retrieveSecondaryMessage } from "./error.js";
import { setErrorCacheHeaders } from "./cache.js";

export function handleError(err, res) {
	console.error(err);

	setErrorCacheHeaders(res);
	if (err instanceof Error) {
		return res.send(
			renderError({
				message: err.message,
				secondaryMessage: retrieveSecondaryMessage(err),
				renderOptions: {
					show_repo_link: !(err instanceof MissingParamError),
				},
			}),
		);
	}
	return res.send(
		renderError({
			message: "An unknown error occurred",
			renderOptions: {},
		}),
	);
}