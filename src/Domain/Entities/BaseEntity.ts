import { ID } from "~/Domain/ValueObjects";

export abstract class Entity {
  protected constructor(public readonly id: ID) {}

  public equals(other: Entity): boolean {
    if (other === null || other === undefined) return false;

    if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(other))
      return false;

    return this.id.equals(other.id);
  }
}
