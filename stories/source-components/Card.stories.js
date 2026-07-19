import "../../src/components/Card/Card.js";
import icons from "../../src/common/icons.js";

const meta = {
	component: "x-card",
	args: {
		colorMode: "light",
		icon: 'contribs',
		heading: "card-example",
		description: "I understand why Superman is here, but why is there a porcupine at the Easter Bunny's funeral?",
		width: 400,
		height: 125,
		footer: "<span>Some footer content</span>"
	},
	argTypes: {
		colorMode: {
			control: { type: "select" },
			options: ["light", "dark"],
		},
		icon: {
			control: { type: 'select' },
			options: Object.keys(icons)
		}
	},
};

export default meta;

export const Card = {};
