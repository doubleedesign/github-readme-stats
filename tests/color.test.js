import { getCardColors } from "../src/common/color";
import { describe, expect, it } from "@jest/globals";

describe("Test color.js", () => {
  it("getCardColors: should return default values", () => {
    let colors = getCardColors({});
    expect(colors).toStrictEqual({
      bg_color: "#fffefe",
      border_color: "#e4e2e2",
      icon_color: "#4c71f2",
      ring_color: "#0000ff",
      text_color: "#434d58",
      title_color: "#2f80ed",
    });
  });
});
