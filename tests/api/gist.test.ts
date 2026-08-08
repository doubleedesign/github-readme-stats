import gist from '../../api/gist.ts';
import { DURATIONS } from '../../src/common/cache.ts';

const mockResponseData = {
	data: {
		viewer: {
			gist: {
				description: 'Some gist description',
				owner: { login: 'doubleedesign', },
				stargazerCount: 0,
				forks: { totalCount: 0, },
				files: [
					{
						name: 'gist.json',
						language: { name: 'JSON', },
						size: 85858,
					},
				],
			},
		},
	},
};

const mockResponse = jest.fn();

describe('/api/gist', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.spyOn(global, 'fetch').mockImplementation((url: string | RequestInfo | URL) => {
			if (url === 'https://api.github.com/graphql') {
				return Promise.resolve({
					ok: true,
					status: 200,
					statusText: 'OK',
					json: mockResponse
				} as unknown as Response);
			}

			return Promise.reject(new Error('Unknown URL'));
		});
	});

	it('should get the repo data and return the expected HTML', async () => {
		mockResponse.mockResolvedValueOnce(mockResponseData);
		const req = { query: { id: 'somegistid', }, };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		await gist(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Some gist description'));
	});

	it('should render error if id is not provided', async () => {
		mockResponse.mockResolvedValueOnce(mockResponseData);
		const req = { query: {}, };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		await gist(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Gist ID is required and must be a string'));
	});

	it('should render error if gist is not found', async () => {
		mockResponse.mockResolvedValueOnce({ data: { viewer: { gist: null }, } });
		const req = { query: { id: 'somegistid', }, };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		await gist(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Gist not found'));
	});

	it('should have proper cache', async () => {
		mockResponse.mockResolvedValueOnce(mockResponseData);
		const req = { query: { id: 'somegistid', }, };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		await gist(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.setHeader).toHaveBeenCalledWith(
			'Cache-Control',
			`max-age=${DURATIONS.TEN_DAY}, s-maxage=${DURATIONS.TEN_DAY}, stale-while-revalidate=${DURATIONS.TEN_DAY}`,
		);
	});
});
