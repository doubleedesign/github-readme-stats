import { request } from "../common/http.js";
import retryer from "../common/retryer.js";
import { DURATIONS, setCacheHeaders } from "../common/cache.js";

export class Fetcher {
	variables = {};
	query = "";
	data = {};
	cache_seconds = DURATIONS.ONE_DAY;

	constructor() {
		if (new.target === Fetcher) {
			throw new Error("Abstract class 'Fetcher' cannot be instantiated directly.");
		}
	}

	_makeRequest(variables, token) {
		return request(
			{ query: this.query, variables },
			{ Authorization: `token ${token}` }
		);
	}

	setHeaders(res)  {
		setCacheHeaders(res, this.cache_seconds);
		res.setHeader("Content-Type", "image/svg+xml");
	}

	async fetch(variables) {
		const res = await retryer(this._makeRequest.bind(this), variables);

		if (res.data.errors) {
			console.error(res.data.errors);
		}

		return res.data.data;
	}
}
