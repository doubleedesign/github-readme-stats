import { GistFetcher } from '../src/fetchers/GistFetcher.js';
import { handleError } from '../src/common/handle-error.js';

export default async (req, res) => {
	const { id } = req.query;
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
