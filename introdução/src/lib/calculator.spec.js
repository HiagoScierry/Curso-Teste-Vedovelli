const { sum } = require("./calculator");

it("Should sum 2 and 2 and result must be 4", () => {
    expect(sum(1, 2)).toBe(3);
});

it("Should sum 2 and 2 even if one of the is a string the result must be 4", () => {
    expect(sum("2", "2")).toBe(4);
});

it("Should throw an error if what is provided to the method cannot be summed", () => {
    expect(() => {
        sum("", "2");
    }).toThrowError();
    expect(() => {
        sum([2, 2]);
    }).toThrowError();
    expect(() => {
        sum({});
    }).toThrowError();
    expect(() => {
        sum();
    }).toThrowError();
});
