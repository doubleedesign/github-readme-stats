import "./preview.css";

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	globalTypes: {
		theme: {
			description: "GitHub theme colour mode",
			toolbar: {
				title: "GitHub theme colour mode",
				icon: "sun",
				items: ["light", "dark", "soft-dark"],
				dynamicTitle: false,
			},
		},
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme ?? 'light';
			const wrapper = document.querySelector(".sb-show-main");
			wrapper?.setAttribute("data-color-mode", theme === 'light' ? 'light' : 'dark');
			wrapper?.setAttribute('data-dark-theme', theme === 'light' ? '' : (theme === 'soft-dark' ? 'dark_dimmed' : 'dark'));

			return Story(context);
		},
	],
};

export default preview;
