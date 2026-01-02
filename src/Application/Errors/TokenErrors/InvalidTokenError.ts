import { TokenError } from "~/Application/Errors/TokenErrors";

export class InvalidTokenError extends TokenError {
  public override readonly code: string = "TOKEN_INVALID";

  public constructor() {
    super("Invalid authentication token");
  }
}
