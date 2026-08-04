// @ts-check
import { renderRepoCard } from "../src/cards/repo.js";
import { guardAccess } from "../src/common/access.js";
import { CACHE_TTL, resolveCacheSeconds, setCacheHeaders } from "../src/common/cache.js";
import { parseBoolean } from "../src/common/ops.js";
import { fetchRepo } from "../src/fetchers/repo.js";
import { handleError } from "../src/common/handle-error.js";

// @ts-ignore
export default async (req, res) => {
	const access = guardAccess({ req, res });
	if (!access.isPassed) {
		return access.result;
	}

	const { username, repo, show_owner, cache_seconds } = req.query;

	try {
		const repoData = await fetchRepo(username, repo);
		const cacheSeconds = resolveCacheSeconds({
			requested: parseInt(cache_seconds, 10),
			def: CACHE_TTL.PIN_CARD.DEFAULT,
			min: CACHE_TTL.PIN_CARD.MIN,
			max: CACHE_TTL.PIN_CARD.MAX,
		});

		setCacheHeaders(res, cacheSeconds);
		res.setHeader("Content-Type", "image/svg+xml");

		const html = renderRepoCard(repoData, {
			show_owner: parseBoolean(show_owner),
		});

		return res.send(html);
	}
	catch (err) {
		return handleError(err, res);
	}
};
