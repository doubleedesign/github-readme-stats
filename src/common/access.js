// @ts-check
import { renderError } from "./render.js";

const guardAccess = ({ req, res }) => {
	if (req?.query?.username !== "doubleedesign") {
		const result = res.send(
			renderError({
				message: "Access Denied",
				secondaryMessage: "Please deploy your own instance",
				renderOptions: {
					show_repo_link: false,
				},
			}),
		);
		return { isPassed: false, result };
	}

	return { isPassed: true };
};

export { guardAccess };
