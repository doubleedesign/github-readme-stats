import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
import { themes } from 'storybook/theming';
import { doubleeTheme } from '@doubleedesign/doublee-site-style';
import './manager.css';

const mergedTheme = create({
	...themes.light,
	...doubleeTheme,
});

addons.setConfig({
	theme: mergedTheme,
});