import { TokenError } from "~/Application/Errors/TokenErrors";

export class TokenGenerationFailed extends TokenError {
  public override readonly code: string = "TOKEN_GENERATION_FAILED";

  public constructor() {
    super("Failed to generate authentication token");
  }
}
