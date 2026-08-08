import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/LanguagesCard/LanguagesCard.ts';
import { type LanguagesCardProps } from '../../src/components/LanguagesCard/LanguagesCard.ts';
import { TopLangsLayout } from '../../src/components/types.ts';

const meta: Meta<LanguagesCardProps> = {
	component: 'x-languages', 
	args: {
		heading: 'Top Languages',
		layout: TopLangsLayout.DEFAULT,
		segments: JSON.stringify([
			{ name: 'JavaScript', size: 2653 },
			{ name: 'PHP', size: 1260 },
			{ name: 'SCSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
		])
	},
	argTypes: {
		layout: {
			control: { type: 'select' },
			options: Object.values(TopLangsLayout)
		},
	},
};

export default meta;
type Story = StoryObj<LanguagesCardProps>;

export const Basic: Story = {};

export const NoHeading: Story = { args: { heading: '' } };