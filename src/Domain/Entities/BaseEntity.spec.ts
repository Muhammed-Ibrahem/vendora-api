import { describe, expect, it } from "@jest/globals";

import { Primitive, ID } from "../ValueObjects";
import { Entity } from "./BaseEntity";

class TestID extends ID {
  protected override _brand!: ID;
  public constructor(private readonly value: string) {
    super();
  }
  protected override *getAtmoicValues(): IterableIterator<Primitive> {
    yield this.value;
  }
}
class TestEntity extends Entity {
  public static create(value: ID) {
    return new TestEntity(value);
  }
}

describe("Base Entity", () => {
  it("Should compare entites by ID", () => {
    const id1 = new TestID("DUMMY_ID");
    const id2 = new TestID("DUMMY_ID");
    const id3 = new TestID("ID_DUMMY");

    const entityOne = TestEntity.create(id1);
    const entityTwo = TestEntity.create(id2);
    const entityThree = TestEntity.create(id3);

    expect(entityOne.equals(entityTwo)).toBe(true);
    expect(entityOne.equals(entityThree)).toBe(false);
  });
});
