import { ErrorToStatusMap } from "../../Presentation/Http/ErrorToStatusMap";
import { DomainError } from "../../Domain/Errors/DomainError";

export abstract class HttpPresenter {
  protected mapErrorToStatus(error: DomainError): number {
    return ErrorToStatusMap.get(error.code) || 500;
  }
}
