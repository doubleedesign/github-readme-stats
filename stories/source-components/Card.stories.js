import "../../src/components/Card/Card.js";
import "../../src/components/Badge/Badge.js";
import { icons } from "../../src/common/icons.js";

const meta = {
	component: "x-card",
	args: {
		icon: 'contribs',
		heading: "card-example",
		description: "I understand why Superman is here, but why is there a porcupine at the Easter Bunny's funeral?",
		footer: "<span style='font-size:0.85rem'>Some footer content</span>",
		width: 420,
		height: 140,
	},
	argTypes: {
		icon: {
			control: { type: 'select' },
			options: Object.keys(icons)
		}
	},
};

export default meta;

export const Basic = {};

export const NoHeading = {
	args: {
		heading: ""
	}
}

export const NoFooter = {
	args: {
		footer: ""
	}
};

export const FooterBadges = {
	args: {
		footer: `
			<x-badge icon="star" label="25" testId="stargazers"></x-badge>
			<x-badge icon="fork" label="10" testId="forks"></x-badge>
		`
	}
}

export const LongDescription = {
	args: {
		description: "Should I use my invisibility to fight crime or for evil? Where do you want to go to lunch? Mama's Little Bakery, Chicago, Illinois. The cushions are the essence of the chair!",
	}
};

export const ShortDescription = {
	args: {
		description: "The cushions are the essence of the chair!",
	}
};

export const NoDescription = {
	args: {
		description: ""
	}
};
