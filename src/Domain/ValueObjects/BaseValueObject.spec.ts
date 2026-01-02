import { describe, expect, it } from "@jest/globals";

import { ValueObject, Primitive } from "./BaseValueObject";

class DummyVO extends ValueObject<DummyVO> {
  protected override _brand!: DummyVO;
  constructor(private readonly value: string) {
    super();
  }
  protected override *getAtmoicValues(): IterableIterator<Primitive> {
    yield this.value;
  }
}

class TestVO extends ValueObject<TestVO> {
  protected override _brand!: TestVO;

  constructor(
    private readonly valueOne: string,
    private readonly valueTwo: number,
    private readonly valueThree: string[],
    private readonly valueFour: Date,
    private readonly valueFive: ValueObject<unknown>,
    private readonly valueSix: ValueObject<unknown>[]
  ) {
    super();
  }

  protected override *getAtmoicValues(): IterableIterator<Primitive> {
    yield this.valueOne;
    yield this.valueTwo;
    yield this.valueThree;
    yield this.valueFour;
    yield this.valueFive;
    yield this.valueSix;
  }
}

describe("ValueObject", () => {
  describe("DummyVO (single value)", () => {
    it("should return true for equal values", () => {
      const dummyOne = new DummyVO("HelloDummy");
      const dummyTwo = new DummyVO("HelloDummy");
      expect(dummyOne.equals(dummyTwo)).toBe(true);
    });

    it("should return false for different values", () => {
      const dummyOne = new DummyVO("HelloDummy");
      const dummyThree = new DummyVO("DummyHellp");
      expect(dummyOne.equals(dummyThree)).toBe(false);
    });
  });

  describe("TestVO (complex values)", () => {
    const dummyOne = new DummyVO("HelloDummy");
    const dummyTwo = new DummyVO("HelloDummy");
    const dummyThree = new DummyVO("DummyHellp");

    it("should return true for equal complex VOs", () => {
      const a = new TestVO(
        "X",
        10,
        ["Hello", "World"],
        new Date("1970-01-01"),
        dummyOne,
        [dummyOne, dummyTwo, dummyThree]
      );
      const b = new TestVO(
        "X",
        10,
        ["Hello", "World"],
        new Date("1970-01-01"),
        dummyTwo,
        [dummyOne, dummyTwo, dummyThree]
      );
      expect(a.equals(b)).toBe(true);
    });

    it("should return false for unequal complex VOs", () => {
      const a = new TestVO(
        "X",
        10,
        ["Hello", "World"],
        new Date("1970-01-01"),
        dummyOne,
        [dummyOne, dummyTwo, dummyThree]
      );
      const c = new TestVO(
        "X",
        10,
        ["World", "Hello"], // swapped array
        new Date("1970-01-01"),
        dummyThree,
        [dummyOne, dummyTwo, dummyThree]
      );
      expect(a.equals(c)).toBe(false);
    });
  });
});
