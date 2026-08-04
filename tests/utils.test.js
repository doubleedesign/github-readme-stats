import { queryByTestId } from "@testing-library/dom";
import {
  kFormatter,
  renderError,
} from "../src/common/utils.js";

describe("Test utils.js", () => {
  it("should test kFormatter", () => {
    expect(kFormatter(1)).toBe(1);
    expect(kFormatter(-1)).toBe(-1);
    expect(kFormatter(500)).toBe(500);
    expect(kFormatter(1000)).toBe("1k");
    expect(kFormatter(10000)).toBe("10k");
    expect(kFormatter(12345)).toBe("12.3k");
    expect(kFormatter(9900000)).toBe("9900k");
  });

  it("should test renderError", () => {
    document.body.innerHTML = renderError("Something went wrong");
    expect(
      queryByTestId(document.body, "message").children[0],
    ).toHaveTextContent(/Something went wrong/gim);
    expect(
      queryByTestId(document.body, "message").children[1],
    ).toBeEmptyDOMElement(2);

    // Secondary message
    document.body.innerHTML = renderError(
      "Something went wrong",
      "Secondary Message",
    );
    expect(
      queryByTestId(document.body, "message").children[1],
    ).toHaveTextContent(/Secondary Message/gim);
  });
});