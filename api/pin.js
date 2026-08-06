import { handleError } from '../src/common/handle-error.js';
import { RepoFetcher } from '../src/fetchers/RepoFetcher.js';

export default async (req, res) => {
	const { repo } = req.query;
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
