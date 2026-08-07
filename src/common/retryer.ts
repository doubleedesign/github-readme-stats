import { CustomError, SECONDARY_ERROR_MESSAGE } from './error.ts';

// Count the number of GitHub API tokens available.
const PATs = Object.keys(process.env).filter((key) => /PAT_\d*$/.exec(key)).length;
export const RETRIES = process.env.NODE_ENV === 'test' ? 7 : (process.env.NODE_ENV === 'development' ? process.env.GITHUB_TOKEN : PATs);

type FetcherFunction = (variables: any, token: string, retries: number) => Promise<any>;

/**
 * Try to execute the fetcher function until it succeeds or the max number of retries is reached.
 *
 * @param {FetcherFunction} fetcher The fetcher function.
 * @param {any} variables Object with arguments to pass to the fetcher function.
 * @param {number} retries How many times to retry.
 * @returns {Promise<any>} The response from the fetcher function.
 */
export const retryer = async (fetcher: FetcherFunction, variables: object, retries: number = 0): Promise<any> => {
	if (!RETRIES) {
		throw new CustomError('No GitHub API tokens found', SECONDARY_ERROR_MESSAGE.NO_TOKENS);
	}

	if (retries > Number(RETRIES)) {
		throw new CustomError(
			'Downtime due to GitHub API rate limiting',
			SECONDARY_ERROR_MESSAGE.MAX_RETRY
		);
	}

	try {
		let response;

		if (process.env.NODE_ENV === 'development') {
			response = await fetcher(
				variables,
				// @ts-ignore
				process.env['GITHUB_TOKEN'],
				// used in tests for faking rate limit
				retries,
			);
		}
		else {
			// try to fetch with the first token since RETRIES is 0 index i'm adding +1
			response = await fetcher(
				variables,
				// @ts-ignore
				process.env[`PAT_${retries + 1}`],
				// used in tests for faking rate limit
				retries,
			);
		}

		// react on both type and message-based rate-limit signals.
		// https://github.com/anuraghazra/github-readme-stats/issues/4425
		const errors = response?.data?.errors;
		const errorType = errors?.[0]?.type;
		const errorMsg = errors?.[0]?.message || '';
		const isRateLimited = (errors && errorType === 'RATE_LIMITED') || /rate limit/i.test(errorMsg);

		// if rate limit is hit increase the RETRIES and recursively call the retryer
		// with username, and current RETRIES
		if (isRateLimited) {
			console.log(`PAT_${retries + 1} Failed`);
			retries++;

			// directly return from the function
			return retryer(fetcher, variables, retries);
		}

		// finally return the response
		return response;
	}
	catch (err) {
		const e = err;

		// network/unexpected error → let caller treat as failure
		// @ts-ignore
		if (!e.response) {
			throw e;
		}
        
		// also checking for bad credentials if any tokens gets invalidated
		// @ts-ignore
		const isBadCredential = e?.response?.data?.message === 'Bad credentials';
		// @ts-ignore
		const isAccountSuspended = e?.response?.data?.message === 'Sorry. Your account was suspended.';

		if (isBadCredential || isAccountSuspended) {
			console.log(`PAT_${retries + 1} Failed`);
			retries++;

			// directly return from the function
			return retryer(fetcher, variables, retries);
		}

		// HTTP error with a response → return it for caller-side handling
		// @ts-ignore
		return e.response;
	}
};

export default retryer;
