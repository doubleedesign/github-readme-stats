import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/Badge/Badge.ts';
import { type BadgeProps } from '../../src/components/Badge/Badge.ts';
import { icons } from '../../src/common/icons.js';

const meta: Meta<BadgeProps> = {
	component: 'x-badge',
	args: {
		icon: 'star',
		label: '25',
		testId: 'stargazers'
	},
	argTypes: {
		icon: {
			control: { type: 'select' },
			options: Object.keys(icons)
		}
	},
};

export default meta;
type Story = StoryObj<BadgeProps>;

export const Badge: Story = {};
