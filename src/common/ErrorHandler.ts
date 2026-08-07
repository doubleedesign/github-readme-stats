import type { Response } from 'express';
import { setErrorCacheHeaders } from './cache.ts';
import { Card } from '../components/Card/Card.ssr.ts';

export class ErrorHandler {
	declare message: string;
	declare res: Response;
    
	constructor(err: Error, res: Response) {
		console.error(err);
		this.res = res;
		this.message = err.message;
	}

	handleError() {
		setErrorCacheHeaders(this.res);
		this.res.setHeader('Content-Type', 'image/svg+xml');
		const html = this.getHtml();

		return this.res.send(html);
	}
    
	getHtml() {
		const card = new Card();
		card.heading = this.message;
		card.icon = 'issues';
		card.theme = 'mono';

		return card.toString();
	}
}