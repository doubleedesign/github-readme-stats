// @ts-check
import { guardAccess } from "../src/common/access.js";
import { CACHE_TTL, resolveCacheSeconds, setCacheHeaders } from "../src/common/cache.js";
import { fetchRepo } from "../src/fetchers/repo.js";
import { handleError } from "../src/common/handle-error.js";
import { Card } from "../src/components/Card/Card.ssr.js";
import {
	get_language_bar_html,
	get_forks_badge_html,
	get_stars_badge_html,
	get_language_badge_html,
} from "../src/common/badges.js";
import { parseEmojis } from "../src/common/ops.js";


const getHtml = (repo) => {
	const { name, description, primaryLanguage, starCount, forkCount } = repo;

	let footerHtml = get_language_badge_html(primaryLanguage?.name, repo?.languages?.edges, repo.name);

	if (starCount > 0) {
		footerHtml += get_stars_badge_html(starCount);
	}

	if (forkCount > 0) {
		footerHtml +=  get_forks_badge_html(forkCount);
	}

	const card = new Card();
	card.beforeContent = repo?.languages?.edges ? get_language_bar_html(repo.languages.edges) : "";
	card.heading = name;
	card.description = parseEmojis(description || "No description provided");
	card.icon = "contribs";
	card.footer = footerHtml;

	return card.toString();
};

// @ts-ignore
export default async (req, res) => {
	guardAccess({ req, res });

	const { username, repo, cache_seconds } = req.query;

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

		const html = getHtml(repoData);

		return res.send(html);
	}
	catch (err) {
		return handleError(err, res);
	}
};
