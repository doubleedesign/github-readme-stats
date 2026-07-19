import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

function htmlToString(html) {
	return html
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

export const withGithubCodeBox = (Story, context) => {
	const colorMode = context.globals.theme || 'light';
	const queryParams = new URLSearchParams({...context.args, colorMode}).toString();
	const apiUrl = context.args.repo
		? `https://github-readme-stats-doubleedesign.vercel.app/api/pin/?${queryParams}`
		: `https://github-readme-stats-doubleedesign.vercel.app/api/gist/?${queryParams}`;
	const linkUrl = context.args.repo
		? `https://github.com/${context.args.username}/${context.args.repo}`
		: `https://gist.github.com/${context.args.username}/${context.args.id}`;

	const code = htmlToString(`
		<a href="${linkUrl}">
			<picture>
			   <source media="(prefers-color-scheme: dark)" srcset="${apiUrl}&colorMode=dark">
			   <img src="${apiUrl}&colorMode=light" />
			</picture>
		</a>
	`);

	setTimeout(() => {
		const codeBlocks = document.querySelectorAll('.github-code code');
		codeBlocks.forEach((block) => {
			Prism.highlightElement(block);
		});
	}, 0);

	return `
		${Story({...context, args: {...context.args, colorMode}})}
		<figure class="github-code prismjs language-html">
			<figcaption>GitHub README code</figcaption>
			<code>
				${code}
			</code>
		</figure>
	`;
};