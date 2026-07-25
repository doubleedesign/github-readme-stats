import { loadEnv } from "vite";

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  framework: "@storybook/web-components-vite",
  viteFinal: async (config, { configType }) => {
    // Will load system env variables as well as .env file from project root
    const env = loadEnv(
      configType,
      process.cwd(),
      "", // prefix filter
    );

    config.define = {
      ...config.define,
      "process.env": JSON.stringify(env),
    };

    return config;
  },
};
export default config;