import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { withGithubCodeBox } from '../../.storybook/decorators/with-github-code-box.js';
import { withRequestUrl } from '../../.storybook/decorators/with-request-url.js';
import type { RepoQueryOptions } from '../../api/types.ts';

const meta: Meta<RepoQueryOptions> = {
	args: {
		repo: 'storybook-addon-accessibility-tree'
	},
	argTypes: {
		repo: {
			control: { type: 'select' },
			options: [
				'storybook-addon-accessibility-tree',
				'fey-factor',
				'legatobase',
				'comet-components',
				'comet-gutenberg-controls',
				'vanilla-toppings',
				'animate-into-view',
				'PowerPress',
				'wp-plugin-template',
				'simple-document-portal',
			],
		},
	},
	decorators: [
		withRequestUrl({ base: 'http://localhost:9000/api/pin/' }),
		withGithubCodeBox('repo')
	],
};

export default meta;
type Story = StoryObj<RepoQueryOptions>;

export const RepoCard: Story = {
	render: (args: RepoQueryOptions) => {
		const queryParams = new URLSearchParams(args).toString();
		const apiUrl = `http://localhost:9000/api/pin/?${queryParams}`;

		// For debugging the source SVG response
		fetch(apiUrl).then((response => response.text())).then((svg) => {
			console.log(svg);
		});

		return `<img alt="${args.repo}" src="${apiUrl}" />`;
	},
};