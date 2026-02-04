import { ValidationMultipleErrors } from "../../../common/domain/errors";
import { Product } from "../products.entity";

describe("Produc entity", () => {
    const validProductData = {
        sku: "ABC_DEF_12",
        title: "Sample Product",
        description: "This is a sample product description.",
        categoryUid: "category-123",
        image: "http://example.com/image.jpg",
        price: 29.99,
        createdDate: new Date("2024-01-01"),
        lastUpdated: new Date("2024-01-02"),
    };

    describe("create", () => {
        it("should create a valid prduct with valid data", async () => {
            const product = Product.create(validProductData);
            expect(product).toBeInstanceOf(Product);
            expect(product.toProps()).toEqual(validProductData);
        });
    });

    describe("validation errors", () => {
        it("should throw an error for empty SKU", async () => {
            const invalidData = { ...validProductData, sku: "" };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("sku should not be empty");
        });

        it("should throw an error for invalid SKU format", async () => {
            const invalidData = { ...validProductData, sku: "INVALIDSKU" };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "Invalid SKU format (must be ###_###_##)"
            );
        });

        it("should throw an error for empty title", async () => {
            const invalidData = { ...validProductData, title: "" };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("title should not be empty");
        });

        it("should throw an error for title too short", async () => {
            const invalidData = { ...validProductData, title: "ab" };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "title must be at least 3 characters long"
            );
        });

        it("should throw an error for title too long", async () => {
            const invalidData = { ...validProductData, title: "a".repeat(256) };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("title must not exceed 255 characters");
        });

        it("should throw multiple errors for invalid SKU and title", async () => {
            const invalidData = { ...validProductData, sku: "", title: "ab" };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toHaveLength(2);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("sku should not be empty");
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "title must be at least 3 characters long"
            );
        });
    });
});

const captureError = <T>(fn: () => T): T | Error => {
    try {
        return fn();
    } catch (error) {
        return error as Error;
    }
};
