import Prism from 'prismjs';

function htmlToString(html) {
	return html
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

export const withGithubCodeBox = (cardType) => (Story, context) => {
	const queryParams = new URLSearchParams(context.args).toString();
	let apiUrl = context.args.repo
		? `https://github-readme-stats-doubleedesign.vercel.app/api/pin/?${queryParams}`
		: `https://github-readme-stats-doubleedesign.vercel.app/api/gist/?${queryParams}`;
	let linkUrl = context.args.repo
		? `https://github.com/${context.args.username}/${context.args.repo}`
		: `https://gist.github.com/${context.args.username}/${context.args.id}`;
	let altText = cardType === 'repo' ? context.args.repo : 'Gist preview';

	if (cardType === 'topLangs') {
		apiUrl = `https://github-readme-stats-doubleedesign.vercel.app/api/top-langs/?${queryParams}`;
		linkUrl = 'https://github.com/doubleedesign/github-readme-stats';
		altText = 'My Top Languages from GitHub stats';
	}

	const code = cardType === 'topLangs'
		? htmlToString(`
			<a href="${linkUrl}">
				<img alt="${altText}" src="${apiUrl}" />
			</a>
		`)
		: htmlToString(`
			<a href="${linkUrl}">
				<img alt="${altText}" src="${apiUrl}" />
			</a>
		`);

	setTimeout(() => {
		const codeBlocks = document.querySelectorAll('.github-code code');
		codeBlocks.forEach((block) => {
			Prism.highlightElement(block);
		});
	}, 0);

	return `
		${Story(context)}
		<figure class="github-code prismjs language-html">
			<figcaption>GitHub README code</figcaption>
			<code>
				${code}
			</code>
		</figure>
	`;
};