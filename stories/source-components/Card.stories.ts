import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/Card/Card.ts';
import { type CardProps } from '../../src/components/Card/Card.ts';
import '../../src/components/Badge/Badge.js';
import { icons } from '../../src/common/icons.js';

const meta: Meta<CardProps> = {
	component: 'x-card',
	args: {
		icon: 'contribs',
		heading: 'card-example',
		description: 'I understand why Superman is here, but why is there a porcupine at the Easter Bunny\'s funeral?',
		footer: '<span style=\'font-size:0.85rem\'>Some footer content</span>',
		width: 420,
		height: 140,
		theme: 'colorful'
	},
	argTypes: {
		icon: {
			control: { type: 'select' },
			options: Object.keys(icons)
		},
		theme: {
			control: { type: 'select' },
			options: ['colorful', 'mono']
		}
	},
};

export default meta;
type Story = StoryObj<CardProps>;

export const Basic: Story = {};

export const MonoTheme: Story = {
	args: { theme: 'mono' },
	parameters: { controls: { exclude: ['theme'] } }
};

export const NoHeading: Story = { args: { heading: '' } };

export const NoFooter: Story = { args: { footer: '' } };

export const FooterBadges: Story = {
	args: {
		footer: `
			<x-badge icon="star" label="25" testId="stargazers"></x-badge>
			<x-badge icon="fork" label="10" testId="forks"></x-badge>
		`
	}
};

export const LongDescription: Story = {
	args: {
		// eslint-disable-next-line max-len
		description: 'Should I use my invisibility to fight crime or for evil? Where do you want to go to lunch? Mama\'s Little Bakery, Chicago, Illinois. The cushions are the essence of the chair!',
	}
};

export const ShortDescription: Story = { args: { description: 'The cushions are the essence of the chair!', } };

export const NoDescription: Story = { args: { description: '' } };
