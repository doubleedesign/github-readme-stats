import { handleError } from '../src/common/handle-error.ts';
import { RepoFetcher } from '../src/fetchers/RepoFetcher.ts';
import type { Request, Response } from 'express';
import type { RepoQueryOptions } from './types.ts';

export default async (req: Request<RepoQueryOptions>, res: Response) => {
	const { repo } = req.query;
	if(!repo || typeof repo !== 'string') {
		return handleError(new Error('Invalid input: Repository name is required and must be a string'), res);
	}

	const fetcher = new RepoFetcher(repo);

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
