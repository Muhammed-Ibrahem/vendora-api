export type Primitive =
  | string
  | number
  | boolean
  | Date
  | ValueObject<unknown>
  | readonly Primitive[];

export abstract class ValueObject<T> {
  protected abstract readonly _brand: T;
  protected abstract getAtmoicValues(): IterableIterator<Primitive>;

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) return false;

    if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(other))
      return false;

    const firstIterator = this.getAtmoicValues();
    const secondIterator = other.getAtmoicValues();

    while (true) {
      const firstResult = firstIterator.next();
      const secondResult = secondIterator.next();

      if (firstResult.done && secondResult.done) return true;

      if (firstResult.done || secondResult.done) return false;

      if (!this.areEqual(firstResult.value, secondResult.value)) return false;
    }
  }

  private areEqual(a: Primitive, b: Primitive): boolean {
    if (a instanceof ValueObject && b instanceof ValueObject) {
      return a.equals(b);
    }

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      return (
        a.length === b.length && a.every((val, i) => this.areEqual(val, b[i]))
      );
    }

    return a === b;
  }
}
