import { Price } from "../price.value.object";

describe("Price value object", () => {
    describe("create", () => {
        it("should create a valid Price with integer value", async () => {
            const priceValue = 29;
            const price = Price.create(priceValue);
            expect(price).toBeInstanceOf(Price);
            expect(price.value).toBe(priceValue);
        });

        it("should create a valid Price with decimal value", async () => {
            const priceValue = 29.99;
            const price = Price.create(priceValue);
            expect(price).toBeInstanceOf(Price);
            expect(price.value).toBe(priceValue);
        });

        it("should create a valid Price with one decimal place", async () => {
            const priceValue = 29.5;
            const price = Price.create(priceValue);
            expect(price).toBeInstanceOf(Price);
            expect(price.value).toBe(priceValue);
        });

        it("should accept zero price", async () => {
            const price = Price.create(0);
            expect(price).toBeInstanceOf(Price);
            expect(price.value).toBe(0);
        });

        it("should accept price with exactly 2 decimal places", async () => {
            const priceValue = 1234.56;
            const price = Price.create(priceValue);
            expect(price.value).toBe(priceValue);
        });

        it("should accept maximum price of 9999.99", async () => {
            const priceValue = 9999.99;
            const price = Price.create(priceValue);
            expect(price.value).toBe(priceValue);
        });
    });

    describe("validation errors", () => {
        it("should throw an error for null price", async () => {
            expect(() => Price.create(null)).toThrow("price is required");
        });

        it("should throw an error for undefined price", async () => {
            expect(() => Price.create(undefined)).toThrow("price is required");
        });

        it("should throw an error for NaN", async () => {
            expect(() => Price.create(NaN)).toThrow("price must be a valid number");
        });

        it("should throw an error for negative price", async () => {
            expect(() => Price.create(-1)).toThrow("price must not be less than 0");
            expect(() => Price.create(-0.01)).toThrow("price must not be less than 0");
            expect(() => Price.create(-100)).toThrow("price must not be less than 0");
        });

        it("should throw an error for price exceeding maximum", async () => {
            expect(() => Price.create(10000)).toThrow("price must not exceed 9999.99");
            expect(() => Price.create(10000.01)).toThrow("price must not exceed 9999.99");
            expect(() => Price.create(99999.99)).toThrow("price must not exceed 9999.99");
        });

        it("should throw an error for more than 2 decimal places", async () => {
            expect(() => Price.create(29.999)).toThrow("price must have a maximum of 2 decimal places");
            expect(() => Price.create(1.123)).toThrow("price must have a maximum of 2 decimal places");
            expect(() => Price.create(0.0001)).toThrow("price must have a maximum of 2 decimal places");
        });

        it("should throw an error for non-number types", async () => {
            expect(() => Price.create("29.99" as any)).toThrow("price must be a valid number");
            expect(() => Price.create("invalid" as any)).toThrow("price must be a valid number");
            expect(() => Price.create({} as any)).toThrow("price must be a valid number");
            expect(() => Price.create([] as any)).toThrow("price must be a valid number");
        });
    });

    describe("equality check", () => {
        it("should return true for equal prices", () => {
            const price1 = Price.create(29.99);
            const price2 = Price.create(29.99);
            expect(price1.equals(price2)).toBe(true);
        });

        it("should return false for different prices", () => {
            const price1 = Price.create(29.99);
            const price2 = Price.create(19.99);
            expect(price1.equals(price2)).toBe(false);
        });

        it("should return true for integer and decimal with .00", () => {
            const price1 = Price.create(29);
            const price2 = Price.create(29.0);
            expect(price1.equals(price2)).toBe(true);
        });

        it("should return true for zero prices", () => {
            const price1 = Price.create(0);
            const price2 = Price.create(0.0);
            expect(price1.equals(price2)).toBe(true);
        });
    });
});
