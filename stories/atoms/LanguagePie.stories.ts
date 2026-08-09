import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/LanguagePie/LanguagePie.ts';
import { type PieProps } from '../../src/components/LanguagePie/LanguagePie.ts';

const meta: Meta<PieProps> = {
	component: 'x-pie',
	args: {
		segments: JSON.stringify([
			{ name: 'JavaScript', size: 2653 },
			{ name: 'PHP', size: 1260 },
			{ name: 'CSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
			{ name: 'Vue', size: 500 },
			{ name: 'C#', size: 700 },
			{ name: 'PowerShell', size: 100 },
		]),
		chartWidth: 100,
	}
};

export default meta;
type Story = StoryObj<PieProps>;

export const LanguagePie: Story = {};
