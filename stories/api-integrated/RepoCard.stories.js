import { withGithubCodeBox } from "../../.storybook/decorators/with-github-code-box.js";
import { withRequestUrl } from "../../.storybook/decorators/with-request-url.js";

const meta = {
  args: {
    username: "doubleedesign",
    repo: "storybook-addon-accessibility-tree",
    show_owner: false,
    show_language: true,
    show_stars: true,
    show_forks: true,
    color_mode: "light",
  },
  argTypes: {
    repo: {
      control: { type: "select" },
      options: [
        "storybook-addon-accessibility-tree",
        "fey-factor",
        "legatobase",
        "comet-components",
        "comet-gutenberg-controls",
        "vanilla-toppings",
        "animate-into-view",
        "PowerPress",
        "wp-plugin-template",
        "simple-document-portal",
      ],
    },
    color_mode: {
      control: { type: "select" },
      options: ["light", "dark"],
    },
  },
  decorators: [
    withRequestUrl({ base: "http://localhost:9000/api/pin/" }),
    withGithubCodeBox,
  ],
};

export default meta;

export const RepoCard = {
  render: (args) => {
    const filtered = Object.fromEntries(Object.entries(args).filter(([key]) => key !== "color_mode"));
    const queryParams = new URLSearchParams(filtered).toString();
    const apiUrl = `http://localhost:9000/api/pin/?${queryParams}`;

    //For debugging the source SVG response
    // fetch(apiUrl).then((response => {
    // 	return response.text();
    // })).then((svg) => {
    // 	console.log(svg);
    // });

    return `<img alt="${args.repo}" src="${apiUrl}" />`;
  },
};