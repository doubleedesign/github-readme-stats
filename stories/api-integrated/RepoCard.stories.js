import { withGithubCodeBox } from "../../.storybook/decorators/with-github-code-box.js";
import { withRequestUrl } from "../../.storybook/decorators/with-request-url.js";

const meta = {
	args: {
		repo: "storybook-addon-accessibility-tree"
	},
	argTypes: {
		repo: {
			control: { type: "select" },
			options: [
				"storybook-addon-accessibility-tree",
				"fey-factor",
				"legatobase",
				"comet-components",
				"comet-gutenberg-controls",
				"vanilla-toppings",
				"animate-into-view",
				"PowerPress",
				"wp-plugin-template",
				"simple-document-portal",
			],
		},
	},
	decorators: [
		withRequestUrl({ base: "http://localhost:9000/api/pin/" }),
		withGithubCodeBox,
	],
};

export default meta;

export const RepoCard = {
	render: (args) => {
		const queryParams = new URLSearchParams(args).toString();
		const apiUrl = `http://localhost:9000/api/pin/?${queryParams}`;

		// For debugging the source SVG response
		fetch(apiUrl).then((response => response.text())).then((svg) => {
			console.log(svg);
		});

		return `<img alt="${args.repo}" src="${apiUrl}" />`;
	},
};