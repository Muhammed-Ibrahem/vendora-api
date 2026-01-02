export type Result<T, E> = Success<T> | Failure<E>;

class Success<T> {
  public readonly success = true;
  public constructor(public readonly value: T) {}
}

class Failure<E> {
  public readonly success = false;
  public constructor(public readonly error: E) {}
}

export const Result = {
  ok<T>(value: T): Result<T, never> {
    return new Success(value);
  },

  error<E>(value: E): Result<never, E> {
    return new Failure(value);
  },
};
