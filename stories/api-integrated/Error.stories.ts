import { withRequestUrl } from '../../.storybook/decorators/with-request-url.js';

const meta = {
	args: {
		repo: 'invalid-repo-name'
	},
	parameters: {
		controls: {
			include: []
		} 
	},
	decorators: [
		withRequestUrl({ base: 'http://localhost:9000/api/pin/' }),
	]
};

export default meta;

export const Error = {
	render: (args: any) => {
		const queryParams = new URLSearchParams(args).toString();
		const apiUrl = `http://localhost:9000/api/pin/?${queryParams}`;

		// For debugging the source SVG response
		fetch(apiUrl).then((response => response.text())).then((svg) => {
			console.log(svg);
		});

		return `<img src="${apiUrl}" />`;
	},
};