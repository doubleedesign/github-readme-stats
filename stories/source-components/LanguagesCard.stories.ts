import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/LanguagesCard/LanguagesCard.ts';
import { type LanguagesCardProps } from '../../src/components/LanguagesCard/LanguagesCard.ts';
import { TopLangsLayout } from '../../src/components/types.ts';

const meta: Meta<LanguagesCardProps> = {
	component: 'x-languages', 
	args: {
		heading: 'Top Languages',
		layout: TopLangsLayout.COMPACT,
		segments: JSON.stringify([
			{ name: 'JavaScript', size: 2653 },
			{ name: 'PHP', size: 1260 },
			{ name: 'CSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
			{ name: 'Vue', size: 500 },
			{ name: 'C#', size: 700 },
			{ name: 'PowerShell', size: 100 },
		]),
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

export const SmallNumber: Story = {
	args: {
		segments: JSON.stringify([
			{ name: 'JavaScript', size: 2653 },
			{ name: 'PHP', size: 1260 },
			{ name: 'CSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
			{ name: 'SQL', size: 500 },
		]),
	},
	parameters: {
		controls: {
			exclude: ['segments']
		}
	}
};

export const LargeNumber: Story = {
	args: {
		segments: JSON.stringify([
			{ name: 'JavaScript', size: 2653 },
			{ name: 'PHP', size: 1260 },
			{ name: 'CSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
			{ name: 'Vue', size: 500 },
			{ name: 'C#', size: 700 },
			{ name: 'PowerShell', size: 100 },
			{ name: 'Ruby', size: 300 },
			{ name: 'Python', size: 100 },
			{ name: 'Java', size: 200 },
			{ name: 'SQL', size: 500 },
			{ name: 'GraphQL', size: 500 },
		]),
	},
	parameters: {
		controls: {
			exclude: ['segments']
		}
	}
};

export const NoHeading: Story = { args: { heading: '' } };