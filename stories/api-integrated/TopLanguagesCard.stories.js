const meta = {
	args: {
		langs_count: 10,
		algorithm: "both",
		layout: "default",
	},
	argTypes: {
		heading: {
			control: { type: "text" },
		},
		algorithm: {
			control: { type: "select" },
			options: ["byte_count", "repo_count", "both"],
		},
		layout: {
			control: { type: "select" },
			options: ["normal", "compact", "donut", "donut-vertical", "pie"],
		},
	},
};
export default meta;


export const TopLanguagesCard = {
	render: (args) => {
		let algorithmParams = {};
		switch (args.algorithm) {
			case "byte_count":
				algorithmParams = {
					size_weight: 1,
					count_weight: 0,
				};
				break;
			case "repo_count":
				algorithmParams = {
					size_weight: 0,
					count_weight: 1,
				};
				break;
			default:
				algorithmParams = {
					size_weight: 0.5,
					count_weight: 0.5,
				};
				break;
		}

		const queryParams = new URLSearchParams({ ...args, ...algorithmParams }).toString();
		const apiUrl = `http://localhost:9000/api/top-langs?${queryParams}`;

		// For debugging the source SVG response
		fetch(apiUrl).then((response => response.text())).then((svg) => {
			console.log(svg);
		});

		return `<img src="${apiUrl}" />`;
	},
};
