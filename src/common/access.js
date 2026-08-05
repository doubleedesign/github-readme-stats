// @ts-check
import { handleError } from "./handle-error.js";
import { CustomError } from "./error.js";

const guardAccess = ({ req, res }) => {
	if (req?.query?.username !== "doubleedesign") {
		handleError(new CustomError("Access Denied", "ACCESS_DENIED"), res);

		return { isPassed: false };
	}

	return { isPassed: true };
};

export { guardAccess };
