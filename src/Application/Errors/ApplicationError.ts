import { IAppError } from "~/Shared/Errors/IAppError";

export abstract class ApplicationError implements IAppError {
  public abstract readonly code: string;

  protected constructor(public readonly message: string) {}
}
