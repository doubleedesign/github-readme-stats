import { handleError } from '../src/common/handle-error.ts';
import type { Request, Response } from 'express';
import { TopLangsFetcher } from '../src/fetchers/TopLangsFetcher.ts';
import type { TopLangsQueryOptions } from './types.ts';

export default async (req: Request<TopLangsQueryOptions>, res: Response) => {
	try {
		// eslint-disable-next-line max-len
		if (req.query.layout !== undefined && (typeof req.query.layout !== 'string' || !['default', 'compact', 'donut', 'donut-vertical', 'pie'].includes(req.query.layout))) {
			// noinspection ExceptionCaughtLocallyJS
			throw new Error(`Invalid layout option: ${req.query.layout}`);
		}

		const fetcher = new TopLangsFetcher(req.query);

		await fetcher.fetch();
		fetcher.setHeaders(res);
		const html = fetcher.getHtml();

		return res.send(html);
	}
	catch (err) {
		// @ts-expect-error TS2345: Argument of type unknown is not assignable to parameter of type Request
		return handleError(err, res);
	}
};
