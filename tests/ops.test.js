import { describe, expect, it } from "@jest/globals";
import {
  parseBoolean,
  parseArray,
  lowercaseTrim,
  chunkArray,
  dateDiff,
} from "../src/common/ops.js";

describe("Test ops.js", () => {
  it("should test parseBoolean", () => {
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean(false)).toBe(false);

    expect(parseBoolean("true")).toBe(true);
    expect(parseBoolean("false")).toBe(false);
    expect(parseBoolean("True")).toBe(true);
    expect(parseBoolean("False")).toBe(false);
    expect(parseBoolean("TRUE")).toBe(true);
    expect(parseBoolean("FALSE")).toBe(false);

    expect(parseBoolean("1")).toBe(undefined);
    expect(parseBoolean("0")).toBe(undefined);
    expect(parseBoolean("")).toBe(undefined);
    // @ts-ignore
    expect(parseBoolean(undefined)).toBe(undefined);
  });

  it("should test parseArray", () => {
    expect(parseArray("a,b,c")).toEqual(["a", "b", "c"]);
    expect(parseArray("a, b, c")).toEqual(["a", " b", " c"]); // preserves spaces
    expect(parseArray("")).toEqual([]);
    // @ts-ignore
    expect(parseArray(undefined)).toEqual([]);
  });

  it("should test lowercaseTrim", () => {
    expect(lowercaseTrim("  Hello World  ")).toBe("hello world");
    expect(lowercaseTrim("already lower")).toBe("already lower");
  });

  it("should test chunkArray", () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunkArray([1, 2, 3, 4, 5], 1)).toEqual([[1], [2], [3], [4], [5]]);
    expect(chunkArray([1, 2, 3, 4, 5], 10)).toEqual([[1, 2, 3, 4, 5]]);
  });

  it("should test dateDiff", () => {
    const a = new Date("2020-01-01T00:10:00Z");
    const b = new Date("2020-01-01T00:00:00Z");
    expect(dateDiff(a, b)).toBe(10);

    const c = new Date("2020-01-01T00:00:00Z");
    const d = new Date("2020-01-01T00:10:30Z");
    // rounds to nearest minute
    expect(dateDiff(c, d)).toBe(-10);
  });
});
