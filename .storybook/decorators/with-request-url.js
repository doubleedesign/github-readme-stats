export const withRequestUrl = ({ base }) => {
	return (Story, context) => {
		const queryParams = new URLSearchParams(context.args).toString();
		const url = `${base}?${queryParams}`;

		return `
			  <figure class="request-url">
				  <figcaption>Request URL:</figcaption>
				  <a href="${url}" target="_blank">${url}</a>
			  </figure>
			  ${Story(context)}
		  `;
	};
};