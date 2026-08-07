import { GistFetcher } from '../src/fetchers/GistFetcher.ts';
import { handleError } from '../src/common/handle-error.js';
import type { Request, Response } from 'express';
import type { GistQueryOptions } from './types.ts';

export default async (req: Request<GistQueryOptions>, res: Response) => {
	const { id } = req.query;
	if(!id || typeof id !== 'string') {
		return handleError(new Error('Invalid input: Gist ID is required and must be a string'), res);
	}

	const fetcher = new GistFetcher(id);

	try {
		await fetcher.fetch();
		fetcher.setHeaders(res);
		const html = fetcher.getHtml();

		return res.send(html);
	}
	catch (err) {
		return handleError(err, res);
	}
};
