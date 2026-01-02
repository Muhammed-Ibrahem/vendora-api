import jwt, { TokenExpiredError as JwtExpiredError } from "jsonwebtoken";

import { TokenGenerationFailed } from "~/Application/Errors/TokenErrors/TokenGenerationFailed";
import { TokenExpiredError } from "~/Application/Errors/TokenErrors/TokenExpieredError";
import { InvalidTokenError } from "~/Application/Errors/TokenErrors/InvalidTokenError";
import { TokenOptions, TokenService } from "~/Application/Ports/TokenService";
import { TokenError } from "~/Application/Errors/TokenErrors";
import { Result } from "~/Domain/ResultPattern";

export class JwtToken implements TokenService {
  private readonly defaultOptions = {
    expiresIn: 15 * 60, // 15 minutes
  };

  public constructor(private readonly secret: string) {}

  public generate<T extends object>(
    payload: T,
    options?: TokenOptions
  ): Result<string, TokenError> {
    try {
      const token = jwt.sign(payload, this.secret, {
        expiresIn: options?.expiresIn || this.defaultOptions.expiresIn,
      });
      return Result.ok(token);
    } catch {
      return Result.error(new TokenGenerationFailed());
    }
  }

  public verify<T extends object>(token: string): Result<T, TokenError> {
    try {
      const decoded = jwt.verify(token, this.secret) as T;
      return Result.ok(decoded);
    } catch (e: unknown) {
      if (e instanceof JwtExpiredError) {
        return Result.error(new TokenExpiredError());
      }
      return Result.error(new InvalidTokenError());
    }
  }
}
