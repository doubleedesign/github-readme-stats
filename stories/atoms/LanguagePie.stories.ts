import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/LanguagePie/LanguagePie.ts';
import { type PieProps } from '../../src/components/LanguagePie/LanguagePie.ts';

const meta: Meta<PieProps> = {
	component: 'x-pie',
	args: {
		segments: JSON.stringify([
			{ name: 'JavaScript', size: 2653 },
			{ name: 'PHP', size: 1260 },
			{ name: 'SCSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
		]),
		chartWidth: 100,
	}
};

export default meta;
type Story = StoryObj<PieProps>;

export const LanguagePie: Story = {};
