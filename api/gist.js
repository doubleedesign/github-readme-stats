// @ts-check
import { renderGistCard } from "../src/cards/gist.js";
import { fetchGist } from "../src/fetchers/gist.js";
import {
	CACHE_TTL,
	resolveCacheSeconds,
	setCacheHeaders,
} from "../src/common/cache.js";
import { guardAccess } from "../src/common/access.js";
import { parseBoolean } from "../src/common/ops.js";
import { handleError } from "../src/common/handle-error.js";

// @ts-ignore
export default async (req, res) => {
	const access = guardAccess({ req, res });
	if (!access.isPassed) {
		return access.result;
	}

	const { id, cache_seconds, show_owner } = req.query;

	try {
		const gistData = await fetchGist(id);
		const cacheSeconds = resolveCacheSeconds({
			requested: parseInt(cache_seconds, 10),
			def: CACHE_TTL.GIST_CARD.DEFAULT,
			min: CACHE_TTL.GIST_CARD.MIN,
			max: CACHE_TTL.GIST_CARD.MAX,
		});

		setCacheHeaders(res, cacheSeconds);
		res.setHeader("Content-Type", "image/svg+xml");

		const html = renderGistCard(gistData, {
			show_owner: parseBoolean(show_owner),
		});

		return res.send(html);
	}
	catch (err) {
		return handleError(err, res);
	}
};
