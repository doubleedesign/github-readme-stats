import type { Request, Response } from 'express';
import type { TopLangsQueryOptions } from './types.ts';
import { TopLangsLayout } from '../src/components/types.ts';
import { TopLangsFetcher } from '../src/fetchers/TopLangsFetcher.ts';
import { ErrorHandler } from '../src/common/ErrorHandler.ts';

export default async (req: Request<TopLangsQueryOptions>, res: Response) => {
	try {
		// @ts-expect-error TS2345: Argument of type string is not assignable to parameter of type TopLangsLayout
		if (req.query.layout !== undefined && (typeof req.query.layout !== 'string' || !Object.values(TopLangsLayout).includes(req.query.layout))) {
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
		// @ts-expect-error TS2345: Argument of type unknown is not assignable to parameter of type Error
		return (new ErrorHandler(err, res)).handleError();
	}
};
