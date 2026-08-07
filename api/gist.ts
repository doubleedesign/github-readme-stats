import { GistFetcher } from '../src/fetchers/GistFetcher.ts';
import { ErrorHandler } from '../src/common/ErrorHandler.ts';
import type { Request, Response } from 'express';
import type { GistQueryOptions } from './types.ts';

export default async (req: Request<GistQueryOptions>, res: Response) => {
	try {
		const { id } = req.query;
		if(!id || typeof id !== 'string') {
			// noinspection ExceptionCaughtLocallyJS
			throw new Error('Invalid input: Gist ID is required and must be a string');
		}

		const fetcher = new GistFetcher(id);

		await fetcher.fetch();
		fetcher.setHeaders(res);
		const html = fetcher.getHtml();

		return res.send(html);
	}
	catch (err) {
		// @ts-expect-error TS2345: Argument of type unknown is not assignable to parameter of type Error
		return (new ErrorHandler(err, res)).handleError();
	}
};
