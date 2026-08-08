import retryer from '../common/retryer.ts';
import { DURATIONS, setCacheHeaders } from '../common/cache.ts';
import { CardFactory } from '../factories/CardFactory.ts';
import type { FetcherFields } from './types.ts';
import type { Response } from 'express';

export class Fetcher implements FetcherFields {
	icon = '';
	variables = {};
	query = '';
	data = {};
	cache_seconds = DURATIONS.ONE_DAY;

	constructor() {
		if (new.target === Fetcher) {
			throw new Error('Abstract class \'Fetcher\' cannot be instantiated directly.');
		}
	}

	async _makeRequest(variables: Record<string, any>, token: string) {
		const res = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `token ${token}`,
			},
			body: JSON.stringify({ query: this.query, variables }),
		});

		if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

		return res.json();
	}

	setHeaders(res: Response)  {
		setCacheHeaders(res, this.cache_seconds);
		res.setHeader('Content-Type', 'image/svg+xml');
	}

	async fetch(variables: Record<string, any>) {
		const res = await retryer(this._makeRequest.bind(this), variables);

		if (res.data.errors) {
			console.error(res.data.errors);
		}

		return res.data;
	}

	getHtml() {
		return CardFactory.generateCardHtml(this.icon, this.data);
	}
}
