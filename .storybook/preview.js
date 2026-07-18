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
				items: ["light", "dark"],
				dynamicTitle: true,
			},
		},
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme;
			const wrapper = document.querySelector(".sb-show-main");
			if (wrapper) {
				wrapper.setAttribute("data-color-mode", theme);
			}

			return Story(context);
		},
	],
};

export default preview;
