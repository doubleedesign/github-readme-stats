// @ts-check

import { renderTopLanguages } from "../src/cards/top-languages.js";
import { guardAccess } from "../src/common/access.js";
import { CACHE_TTL, resolveCacheSeconds, setCacheHeaders } from "../src/common/cache.js";
import { parseArray } from "../src/common/ops.js";
import { CustomError } from "../src/common/error.js";
import { fetchTopLanguages } from "../src/fetchers/top-languages.js";
import { handleError } from "../src/common/handle-error.js";

// @ts-ignore
export default async (req, res) => {
	guardAccess({ req, res });

	const {
		username,
		heading,
		layout,
		langs_count,
		exclude_langs,
		exclude_repos,
		size_weight,
		count_weight,
		cache_seconds,
	} = req.query;

	if (layout !== undefined && (typeof layout !== "string" || !["default", "compact", "donut", "donut-vertical", "pie"].includes(layout))) {
		handleError(new CustomError("Invalid input", `${layout} is not a valid layout option`), res);
	}

	try {
		const queryResponse = await fetchTopLanguages({
			username,
			exclude_repos: parseArray(exclude_repos),
			exclude_langs: parseArray(exclude_langs),
			size_weight,
			count_weight,
		});

		const cacheSeconds = resolveCacheSeconds({
			requested: parseInt(cache_seconds, 10),
			def: CACHE_TTL.TOP_LANGS_CARD.DEFAULT,
			min: CACHE_TTL.TOP_LANGS_CARD.MIN,
			max: CACHE_TTL.TOP_LANGS_CARD.MAX,
		});

		setCacheHeaders(res, cacheSeconds);
		res.setHeader("Content-Type", "image/svg+xml");

		const html = renderTopLanguages(queryResponse, {
			heading,
			layout,
			langs_count: parseInt(langs_count, 10),
		});

		return res.send(html);
	}
	catch (err) {
		return handleError(err, res);
	}
};
