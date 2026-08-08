import topLangs from '../../api/top-langs.ts';
import { DURATIONS } from '../../src/common/cache.ts';

const mockResponse = {
	data: {
		user: {
			repositories: {
				nodes: [
					{ languages: { edges: [{ size: 150, node: { color: '#0f0', name: 'HTML' } }] } },
					{ languages: { edges: [{ size: 100, node: { color: '#0f0', name: 'HTML' } }] } },
					{
						languages: {
							edges: [
								{ size: 100, node: { color: '#0ff', name: 'javascript' } },
							],
						},
					},
					{
						languages: {
							edges: [
								{ size: 100, node: { color: '#0ff', name: 'javascript' } },
							],
						},
					},
				],
			},
		},
	},
};

describe('/api/top-langs', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.spyOn(global, 'fetch').mockImplementation((url: string | RequestInfo | URL) => {
			if (url === 'https://api.github.com/graphql') {
				return Promise.resolve({
					ok: true,
					status: 200,
					statusText: 'OK',
					json: () => Promise.resolve(mockResponse)
				} as unknown as Response);
			}

			return Promise.reject(new Error('Unknown URL'));
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should get language data and return the expected HTML', async () => {
		const req = { query: { layout: 'default' } };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		// @ts-expect-error TS2345: Argument of type { query: {}; } is not assignable to parameter of type Request
		await topLangs(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Top Languages'));
	});

	it('should render error card on incorrect layout input', async () => {
		const req = { query: { layout: 'venn' }, };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		// @ts-expect-error TS2345: Argument of type { query: {}; } is not assignable to parameter of type Request
		await topLangs(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Invalid layout option: venn'));
	});

	it('should have proper cache', async () => {
		const req = { query: {} };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		// @ts-expect-error TS2345: Argument of type { query: {}; } is not assignable to parameter of type Request
		await topLangs(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.setHeader).toHaveBeenCalledWith(
			'Cache-Control',
			`max-age=${DURATIONS.ONE_DAY}, s-maxage=${DURATIONS.ONE_DAY}, stale-while-revalidate=${DURATIONS.ONE_DAY}`,
		);
	});
});
