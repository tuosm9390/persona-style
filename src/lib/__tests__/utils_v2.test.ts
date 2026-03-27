import { describe, it, expect } from "vitest";
import { formatTextWithLineBreaks } from "../utils";

describe("formatTextWithLineBreaks", () => {
  it("should split text by explicit newline characters", () => {
    const input = "Line 1\nLine 2\r\nLine 3";
    const result = formatTextWithLineBreaks(input);
    expect(result).toEqual(["Line 1", "Line 2", "Line 3"]);
  });

  it("should split long lines by periods followed by spaces", () => {
    const input = "This is a very long sentence that exceeds one hundred characters to test if the splitting logic works correctly. And this is the second part of it.";
    const result = formatTextWithLineBreaks(input);
    expect(result.length).toBeGreaterThan(1);
    expect(result[0]).toContain("test if the splitting logic works correctly.");
  });

  it("should filter out empty lines", () => {
    const input = "Line 1\n\nLine 2";
    const result = formatTextWithLineBreaks(input);
    expect(result).toEqual(["Line 1", "Line 2"]);
  });

  it("should return empty array for null or empty string", () => {
    expect(formatTextWithLineBreaks("")).toEqual([]);
    expect(formatTextWithLineBreaks(null as unknown as string)).toEqual([]);
  });
});
