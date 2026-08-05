// @ts-check
import { fetchGist } from "../src/fetchers/gist.js";
import {
	CACHE_TTL,
	resolveCacheSeconds,
	setCacheHeaders,
} from "../src/common/cache.js";
import { handleError } from "../src/common/handle-error.js";
import { parseEmojis } from "../src/common/ops.js";
import { Card } from "../src/components/Card/Card.ssr.js";
import { get_forks_badge_html, get_stars_badge_html, get_language_badge_html } from "../src/common/badges.js";


export const getHtml = (gistData) => {
	const { name, description, language, starCount, forkCount } = gistData;
	let footerHtml = get_language_badge_html(language, []);

	if (starCount > 0) {
		footerHtml += get_stars_badge_html(starCount);
	}

	if (forkCount > 0) {
		footerHtml +=  get_forks_badge_html(forkCount);
	}

	const card = new Card();
	card.heading = name;
	card.description = parseEmojis(description || "No description provided");
	card.icon = "gist";
	card.footer = footerHtml;

	return card.toString();
};


// @ts-ignore
export default async (req, res) => {
	const { id, cache_seconds } = req.query;

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

		const html = getHtml(gistData);

		return res.send(html);
	}
	catch (err) {
		return handleError(err, res);
	}
};
