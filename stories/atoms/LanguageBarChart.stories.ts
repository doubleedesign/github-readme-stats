import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/LanguageBarChart/LanguageBarChart.ts';
import { type BarChartProps } from '../../src/components/LanguageBarChart/LanguageBarChart.ts';

const meta: Meta<BarChartProps> = {
	component: 'x-barchart',
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
		strokeWidth: 8
	},
};

export default meta;
type Story = StoryObj<BarChartProps>;

export const LanguageBarChart: Story = {};
