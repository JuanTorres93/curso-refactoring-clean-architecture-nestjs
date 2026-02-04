import { SKU } from "../sku.value.object";

describe("SKU value object", () => {
    describe("create", () => {
        it("should create a valid SKU with correct format", async () => {
            const skuValue = "ABC_DEF_12";
            const sku = SKU.create(skuValue);
            expect(sku).toBeInstanceOf(SKU);
            expect(sku.value).toBe(skuValue);
        });
    });

    describe("validation errors", () => {
        it("should throw an error for empty SKU", async () => {
            expect(() => SKU.create("")).toThrow("sku should not be empty");
            expect(() => SKU.create("   ")).toThrow("sku should not be empty");
            expect(() => SKU.create(null)).toThrow("sku should not be empty");
            expect(() => SKU.create(undefined)).toThrow("sku should not be empty");
        });

        it("should throw an error for invalid SKU format", async () => {
            const invalidSkus = [
                "AB_DEF_12", // Too short in first segment
                "ABCD_DEF_12", // Too long in first segment
                "ABC_DE_12", // Too short in second segment
                "ABC_DEFG_12", // Too long in second segment
                "ABC_DEF_1", // Too short in third segment
                "ABC_DEF_123", // Too long in third segment
                "ABC-DEF-12", // Invalid characters
                "ABC DEF 12", // Spaces instead of underscores
                "abcdef_12", // Lowercase letters
                "ABCDEF12", // Missing underscores
            ];

            for (const invalidSku of invalidSkus) {
                expect(() => SKU.create(invalidSku)).toThrow("Invalid SKU format (must be ###_###_##)");
            }
        });
    });

    describe("equality check", () => {
        it("should return true for equal SKUs", () => {
            const sku1 = SKU.create("ABC_DEF_12");
            const sku2 = SKU.create("ABC_DEF_12");
            expect(sku1.equals(sku2)).toBe(true);
        });

        it("should return false for different SKUs", () => {
            const sku1 = SKU.create("ABC_DEF_12");
            const sku2 = SKU.create("XYZ_123_45");
            expect(sku1.equals(sku2)).toBe(false);
        });
    });
});
