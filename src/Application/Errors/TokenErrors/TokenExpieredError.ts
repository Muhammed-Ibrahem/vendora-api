import { TokenError } from "~/Application/Errors/TokenErrors";

export class TokenExpiredError extends TokenError {
  public override readonly code: string = "TOKEN_EXPIRED";

  public constructor() {
    super("Authentication token expired");
  }
}
