import "../../src/components/LanguageBar/LanguageBar.js";

const meta = {
	component: "x-langbar",
	args: {
		segments: JSON.stringify([
			{ name: 'TypeScript', size: 2653 },
			{ name: 'JavaScript', size: 1260 },
			{ name: 'CSS', size: 2254 },
			{ name: 'HTML', size: 1200 },
		])
	},
};

export default meta;

export const LanguageBar = {};
