import { RepoFetcher } from '../src/fetchers/RepoFetcher.ts';
import { ErrorHandler } from '../src/common/ErrorHandler.ts';
import type { Request, Response } from 'express';
import type { RepoQueryOptions } from './types.ts';

export default async (req: Request<RepoQueryOptions>, res: Response) => {
	try {
		const { repo } = req.query;
		if(!repo || typeof repo !== 'string') {
			// noinspection ExceptionCaughtLocallyJS
			throw new Error('Invalid input: Repository name is required and must be a string');
		}

		const fetcher = new RepoFetcher(repo);

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
