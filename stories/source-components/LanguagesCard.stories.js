import "../../src/components/LanguagesCard/LanguagesCard.js";

const meta = {
	component: "x-languages",
	args: {
		heading: "Top Languages",
		layout: "default"
	},
	argTypes: {
		layout: {
			control: { type: "select" },
			options: ["default", "compact", "donut", "donut-vertical", "pie"],
		},
	},
};

export default meta;

export const Basic = {};

export const NoHeading = {
	args: {
		heading: ""
	}
}