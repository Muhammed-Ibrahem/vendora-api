import { TokenError } from "~/Application/Errors/TokenErrors";
import { Result } from "~/Domain/ResultPattern";

export interface TokenOptions {
  expiresIn: number;
}
export interface TokenService {
  generate<T extends object>(
    payload: T,
    options?: TokenOptions
  ): Result<string, TokenError>;
  verify<T extends object>(token: string): Result<T, TokenError>;
}
