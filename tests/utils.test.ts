import { kFormatter } from '../src/components/utils.ts';

describe('Utils', () => {
	it('kFormatter', () => {
		expect(kFormatter(1)).toBe('1');
		expect(kFormatter(-1)).toBe('-1');
		expect(kFormatter(500)).toBe('500');
		expect(kFormatter(1000)).toBe('1k');
		expect(kFormatter(10000)).toBe('10k');
		expect(kFormatter(12345)).toBe('12.3k');
		expect(kFormatter(9900000)).toBe('9900k');
	});
});