import { withRequestUrl } from "../../.storybook/decorators/with-request-url.js";

const meta = {
	args: {
		username: "doubleedesign",
		repo: "invalid-repo-name",
	},
	parameters: {
		controls: {
			include: []
		}
	},
	decorators: [
		withRequestUrl({ base: "http://localhost:9000/api/pin/" }),
	]
};

export default meta;

export const RepoNotFound = {
	render: (args) => {
		const queryParams = new URLSearchParams(args).toString();
		const apiUrl = `http://localhost:9000/api/pin/?${queryParams}`;

		// For debugging the source SVG response
		fetch(apiUrl).then((response => response.text())).then((svg) => {
			console.log(svg);
		});

		return `<img src="${apiUrl}" />`;
	},
};

export const AccessDenied = {
	args: {
		username: "unauthorized-user",
	},
	render: (args) => {
		const queryParams = new URLSearchParams(args).toString();
		const apiUrl = `http://localhost:9000/api/pin/?${queryParams}`;

		// For debugging the source SVG response
		fetch(apiUrl).then((response => response.text())).then((svg) => {
			console.log(svg);
		});

		return `<img src="${apiUrl}" />`;
	},
};