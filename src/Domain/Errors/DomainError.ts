import { IAppError } from "~/Shared/Errors/IAppError";

export abstract class DomainError implements IAppError {
  public abstract readonly code: string;

  public constructor(public readonly message: string) {}
}
