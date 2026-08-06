import { CustomError } from '../src/common/error.js';
import { handleError } from '../src/common/handle-error.js';
import type { Request, Response } from 'express';
import { TopLangsFetcher } from '../src/fetchers/TopLangsFetcher.ts';
import type { TopLangOptions } from './types.ts';

export default async (req: Request<TopLangOptions>, res: Response) => {
	// eslint-disable-next-line max-len
	if (req.query.layout !== undefined && (typeof req.query.layout !== 'string' || !['default', 'compact', 'donut', 'donut-vertical', 'pie'].includes(req.query.layout))) {
		return handleError(new CustomError('Invalid input', `${req.query.layout} is not a valid layout option`), res);
	}

	const fetcher = new TopLangsFetcher(req.query);

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
