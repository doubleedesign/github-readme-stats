import { RETRIES, retryer } from '../src/common/retryer.ts';

const fetcher = jest.fn((variables, token) => {
	console.log(variables, token);

	return new Promise((res) => res({ data: 'ok' })); 
});

const fetcherFail = jest.fn(() => {
	return new Promise((res) =>
		res({ data: { errors: [{ type: 'RATE_LIMITED' }] } }),
	);
});

const fetcherFailOnSecondTry = jest.fn((_vars, _token, retries) => {
	return new Promise((res) => {
		// faking rate limit
		// @ts-ignore
		if (retries < 1) {
			return res({ data: { errors: [{ type: 'RATE_LIMITED' }] } });
		}

		return res({ data: 'ok' });
	});
});

const fetcherFailWithMessageBasedRateLimitErr = jest.fn(
	(_vars, _token, retries) => {
		return new Promise((res) => {
			// faking rate limit
			// @ts-ignore
			if (retries < 1) {
				return res({
					data: {
						errors: [
							{
								type: 'ASDF',
								message: 'API rate limit already exceeded for user ID 11111111',
							},
						],
					},
				});
			}

			return res({ data: 'ok' });
		});
	},
);

describe('Test Retryer', () => {
	it('retryer should return value and have zero retries on first try', async () => {
		let res = await retryer(fetcher, {});

		expect(fetcher).toHaveBeenCalledTimes(1);
		expect(res).toStrictEqual({ data: 'ok' });
	});

	it('retryer should return value and have 2 retries', async () => {
		let res = await retryer(fetcherFailOnSecondTry, {});

		expect(fetcherFailOnSecondTry).toHaveBeenCalledTimes(2);
		expect(res).toStrictEqual({ data: 'ok' });
	});

	it('retryer should return value and have 2 retries with message based rate limit error', async () => {
		let res = await retryer(fetcherFailWithMessageBasedRateLimitErr, {});

		expect(fetcherFailWithMessageBasedRateLimitErr).toHaveBeenCalledTimes(2);
		expect(res).toStrictEqual({ data: 'ok' });
	});

	it('retryer should throw specific error if maximum retries reached', async () => {
		try {
			await retryer(fetcherFail, {});
		}
		catch (err) {
			// @ts-expect-error TS18048: RETRIES is possibly undefined
			expect(fetcherFail).toHaveBeenCalledTimes(RETRIES + 1);
			// @ts-expect-error TS18046: err is of type unknown
			expect(err.message).toBe('GitHub API rate limit exceeded');
		}
	});
});
