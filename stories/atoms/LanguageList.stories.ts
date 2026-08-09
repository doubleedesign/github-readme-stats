import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/components/LanguageList/LanguageList.ts';
import { type LanguageListProps } from '../../src/components/LanguageList/LanguageList.ts';

const meta: Meta<LanguageListProps> = {
	component: 'x-list',
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
		layout: 'narrow'
	},
	argTypes: {
		layout: {
			control: { type: 'select' },
			options: ['narrow', 'wide']
		}
	}
};

export default meta;
type Story = StoryObj<LanguageListProps>;

export const Basic: Story = {};

export const WithMergedLanguageNames: Story = {
	args: {
		segments: JSON.stringify([
			{ name: 'JavaScript & TypeScript', size: 3653 },
			{ name: 'PHP', size: 1260 },
			{ name: 'CSS & SCSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
			{ name: 'Vue', size: 500 },
			{ name: 'C#', size: 700 },
			{ name: 'PowerShell', size: 100 },
		]),
	},
	parameters: {
		controls: {
			exclude: ['segments']
		}
	}
};

