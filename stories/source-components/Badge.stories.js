import "../../src/components/Badge/Badge.js";
import { icons } from "../../src/common/icons.js";

const meta = {
	component: "x-badge",
	args: {
		icon: "star",
		label: "25",
		testId: "stargazers"
	},
	argTypes: {
		icon: {
			control: { type: 'select' },
			options: Object.keys(icons)
		}
	},
};

export default meta;

export const Badge = {};
