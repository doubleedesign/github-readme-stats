import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { LanguageRankingAlgorithm } from '../../src/fetchers/types.ts';
import { TopLangsLayout } from '../../src/components/types.ts';
import type { TopLangsQueryOptions } from '../../api/types.ts';
import { withRequestUrl } from '../../.storybook/decorators/with-request-url.js';

const meta: Meta<TopLangsQueryOptions> = {
	args: {
		langs_count: 10,
		algorithm: LanguageRankingAlgorithm.BOTH,
		layout: TopLangsLayout.DEFAULT
	},
	argTypes: {
		heading: {
			control: { type: 'text' },
		},
		algorithm: {
			control: { type: 'select' },
			options: Object.values(LanguageRankingAlgorithm)
		},
		layout: {
			control: { type: 'select' },
			options: Object.values(TopLangsLayout)
		},
		langs_count: {
			control: { type: 'number' },
		}
	},
	decorators: [
		withRequestUrl({ base: 'http://localhost:9000/api/top-langs/' }),
	]
};

export default meta;
type Story = StoryObj<TopLangsQueryOptions>;


export const TopLanguagesCard: Story = {
	render: (args: TopLangsQueryOptions) => {
		const queryArgs = {
			...args,
			langs_count: args.langs_count?.toString() || '10',
		};

		const queryParams = new URLSearchParams(queryArgs).toString();
		const apiUrl = `http://localhost:9000/api/top-langs?${queryParams}`;

		// For debugging the source SVG response
		fetch(apiUrl).then((response => response.text())).then((svg) => {
			console.log(svg);
		});

		return `<img src="${apiUrl}" />`;
	},
};
