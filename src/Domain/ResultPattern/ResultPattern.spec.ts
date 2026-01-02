import { describe, expect, it } from "@jest/globals";

import { Result } from "./index";

describe("ResultPattern", () => {
  it("Create a success result", () => {
    const result = Result.ok(42);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(42);
    }
  });

  it("Creates a failure result", () => {
    const error = new Error("Fail");
    const result = Result.error(error);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(error);
    }
  });
});
