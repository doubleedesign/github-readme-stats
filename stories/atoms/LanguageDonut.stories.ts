import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/LanguageDonut/LanguageDonut.ts';
import { type DonutProps } from '../../src/components/LanguageDonut/LanguageDonut.ts';

const meta: Meta<DonutProps> = {
	component: 'x-donut',
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
		strokeWidth: 12
	}
};

export default meta;
type Story = StoryObj<DonutProps>;

export const LanguageDonut: Story = {};
