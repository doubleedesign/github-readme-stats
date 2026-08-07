import { renderError, SECONDARY_ERROR_MESSAGE } from './error.ts';
import { setErrorCacheHeaders } from './cache.ts';
import type { Request, Response } from 'express';

export function handleError(err: Request, res: Response) {
	console.error(err);

	setErrorCacheHeaders(res);
	res.setHeader('Content-Type', 'image/svg+xml');

	if (err instanceof Error) {
		return res.send(
			renderError({ message: err.message, })
		);
	}

	return res.send(
		renderError({
			message: 'Something went wrong',
			secondaryMessage: SECONDARY_ERROR_MESSAGE.UNKNOWN_ERROR,
		}),
	);
}