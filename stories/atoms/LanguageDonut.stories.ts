import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/LanguageDonut/LanguageDonut.ts';
import { type DonutProps } from '../../src/components/LanguageDonut/LanguageDonut.ts';

const meta: Meta<DonutProps> = {
	component: 'x-donut',
	args: {
		segments: JSON.stringify([
			{ name: 'JavaScript', size: 2653 },
			{ name: 'PHP', size: 1260 },
			{ name: 'SCSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
		]),
		chartWidth: 100,
		strokeWidth: 12
	}
};

export default meta;
type Story = StoryObj<DonutProps>;

export const LanguageDonut: Story = {};
