import { withGithubCodeBox } from "../../.storybook/decorators/with-github-code-box.js";
import { withRequestUrl } from "../../.storybook/decorators/with-request-url.js";

const meta = {
	args: {
		id: "6ff3645f081ae219edbf5d5d2e7f3dd1",
	},
	decorators: [
		withRequestUrl({base: 'http://localhost:9000/api/gist/'}),
		withGithubCodeBox,
	],
};

export default meta;

export const GistCard = {
	render: (args) => {
		const queryParams = new URLSearchParams(args).toString();
		const apiUrl = `http://localhost:9000/api/gist/?${queryParams}`;

		// For debugging the source SVG response
		fetch(apiUrl).then((response => response.text())).then((svg) => {
			console.log(svg);
		});

		return `<img src="${apiUrl}" />`;
	},
};
