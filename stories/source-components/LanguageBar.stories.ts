import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/LanguageBar/LanguageBar.ts';
import { type LanguageBarProps } from '../../src/components/LanguageBar/LanguageBar.ts';

const meta: Meta<LanguageBarProps> = {
	component: 'x-langbar',
	args: {
		segments: JSON.stringify([
			{ name: 'JavaScript', size: 2653 },
			{ name: 'PHP', size: 1260 },
			{ name: 'SCSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
		])
	},
};

export default meta;
type Story = StoryObj<LanguageBarProps>;

export const LanguageBar: Story = {};
