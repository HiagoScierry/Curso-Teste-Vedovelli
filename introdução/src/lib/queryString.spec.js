import { queryString, parse } from "./queryString";

describe("Object to query string", () => {
    it("Should create a valid query string when an object is provided", () => {
        const obj = {
            name: "Hiago",
            profession: "Developer"
        };

        expect(queryString(obj)).toBe(
            "name=Hiago&profession=Developer"
        );
    });


    it("Should create a valid query string even when an array is passed as value", () => {
        const obj = {
            name: "Hiago",
            abilities: ["JS", "TDD"]
        };

        expect(queryString(obj)).toBe(
            "name=Hiago&abilities=JS,TDD"
        );
    });

    it("Should throw an error when an object is passed as value", () => {
        const obj = {
            name: "Hiago",
            abilities: {
                first: "JS",
                second: "TDD"
            }
        };

        expect(() => {
            queryString(obj);
        }).toThrowError();
    });

});

describe("Query string to object", () => {
    it("Should convert a query string to object", () => {
        const qs = "name=Hiago&profession=Developer";

        expect(parse(qs)).toEqual({
            name: "Hiago",
            profession: "Developer"
        });
    });

    it("Should convert a query string of a single key-value pair to object", () => {
        const qs = "name=Hiago";

        expect(parse(qs)).toEqual({
            name: "Hiago"
        });
    });

    it("Should convert a query string to an object taking care of comma separated values", () => {
        const qs = "name=Hiago&abilities=JS,TDD";

        expect(parse(qs)).toEqual({
            name: "Hiago",
            abilities: ["JS", "TDD"]
        });
    });

});