import pin from '../../api/pin.ts';
import { DURATIONS } from '../../src/common/cache.ts';

let mockResponseData = {
	data: {
		user: {
			repository: {
				username: 'doubleedesign',
				name: 'fey-factor',
				description: 'Solving TV show decision fatigue with weighted "Bacon number" calculations, but for Tina Fey.',
				primaryLanguage: {
					color: '#2b7489',
					name: 'TypeScript',
				},
				forkCount: 0,
				isTemplate: false,
				isArchived: false,
			}
		},
		errors: null
	},
};

const mockResponse = jest.fn();

describe('/api/pin', () => {
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

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should get the repo data and return the expected HTML', async () => {
		mockResponse.mockResolvedValueOnce(mockResponseData);
		const req = { query: { repo: 'fey-factor' }, };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		// @ts-expect-error TS2345: Argument of type { query: {}; } is not assignable to parameter of type Request
		await pin(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.send).toHaveBeenCalledWith(expect.stringContaining('fey-factor'));
	});

	it('should render error card if user repo not found', async () => {
		mockResponse.mockResolvedValueOnce({ data: { user: { repository: null }, } });

		const req = { query: { repo: 'invalid-repo' }, };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		// @ts-expect-error TS2345: Argument of type { query: {}; } is not assignable to parameter of type Request
		await pin(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Repository not found'));
	});

	it('should render error card if missing required parameters', async () => {
		mockResponse.mockResolvedValueOnce({ data: { user: { repository: null }, } });
		const req = { query: {}, };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		// @ts-expect-error TS2345: Argument of type { query: {}; } is not assignable to parameter of type Request
		await pin(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Invalid input: Repository name is required and must be a string'));
	});

	it('should have proper cache', async () => {
		mockResponse.mockResolvedValueOnce(mockResponseData);
		const req = { query: { repo: 'fey-factor' }, };
		const res = {
			setHeader: jest.fn(),
			send: jest.fn(),
		};

		// @ts-expect-error TS2345: Argument of type { query: {}; } is not assignable to parameter of type Request
		await pin(req, res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
		expect(res.setHeader).toHaveBeenCalledWith(
			'Cache-Control',
			`max-age=${DURATIONS.TEN_DAY}, s-maxage=${DURATIONS.TEN_DAY}, stale-while-revalidate=${DURATIONS.TEN_DAY}`,
		);
	});
});
