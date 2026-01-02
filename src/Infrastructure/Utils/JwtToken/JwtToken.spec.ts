import {
  beforeAll,
  afterEach,
  describe,
  afterAll,
  expect,
  jest,
  it,
} from "@jest/globals";
import jwt from "jsonwebtoken";

import {
  TokenGenerationFailed,
  InvalidTokenError,
  TokenExpiredError,
} from "~/Application/Errors";
import { TokenService } from "~/Application/Ports/TokenService";
import { JwtToken } from "~/Infrastructure/Utils";

describe("JwtToken", () => {
  let tokenService: TokenService;

  beforeAll(() => {
    tokenService = new JwtToken("DUMMY_SECRET");
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Generate a JWT Token", () => {
    const generatedTokenResult = tokenService.generate({ userId: "123" });

    expect(generatedTokenResult.success).toBe(true);
    if (generatedTokenResult.success) {
      expect(typeof generatedTokenResult.value).toBe("string");
    }
  });

  it("Verifies a valid JWT token", () => {
    const token = tokenService.generate({ userId: "123" });
    if (!token.success) throw new Error();

    const result = tokenService.verify<{ userId: string }>(token.value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.userId).toBe("123");
    }
  });

  it("Returns TokenGenerationFailed when jwt.sign throws", () => {
    const signMock = jest.spyOn(jwt, "sign").mockImplementation(() => {
      throw new Error("Some Internal Error");
    });

    const result = tokenService.generate({ userId: "123" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(TokenGenerationFailed);
    }
    signMock.mockRestore();
  });

  it("Returns InvalidTokenError for malformed token", () => {
    const result = tokenService.verify("invalid.token");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(InvalidTokenError);
    }
  });

  it("Returns TokenExpiredError for expired token", async () => {
    const clock = jest.useFakeTimers();
    const tokenResult = tokenService.generate(
      { userId: "123" },
      {
        expiresIn: 1, // expires after 1 second, JWT expects time in seconds not ms
      }
    );

    if (!tokenResult.success) throw new Error();

    clock.advanceTimersByTime(10_000); // advance by 10 seconds

    const verifyResult = tokenService.verify<{ userId: string }>(
      tokenResult.value
    );

    expect(verifyResult.success).toBe(false);
    if (!verifyResult.success) {
      expect(verifyResult.error).toBeInstanceOf(TokenExpiredError);
    }
  });
});
