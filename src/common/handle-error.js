import { renderError } from "./error.js";
import { retrieveSecondaryMessage } from "./error.js";
import { setErrorCacheHeaders } from "./cache.js";

export function handleError(err, res) {
	console.error(err);

	setErrorCacheHeaders(res);
	res.setHeader("Content-Type", "image/svg+xml");

	if (err instanceof Error) {
		return res.send(
			renderError({
				message: err.message,
				secondaryMessage: retrieveSecondaryMessage(err)
			}),
		);
	}

	return res.send(
		renderError({
			message: "Something went wrong",
			secondaryMessage: "An unknown error occurred",
		}),
	);
}