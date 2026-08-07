/**
 * Send GraphQL request to the GitHub API.
 * @param {object} data - The GraphQL query (as a string) and variables.
 * @param {HeadersInit} headers - The request headers, including auth (bearer token).
 * @returns {Promise<any>} The response.
 */
export async function request(data: object, headers: HeadersInit): Promise<any> {
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers,
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

	return await res.json();
}
