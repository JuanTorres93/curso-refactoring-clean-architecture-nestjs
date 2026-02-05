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

        it("should create a product with valid createdDate and lastUpdate in props", async () => {
            const product = Product.create(validProductData);

            expect(product).toBeInstanceOf(Product);
            expect(product.createdDate).toEqual(validProductData.createdDate);
            expect(product.lastUpdated).toEqual(validProductData.lastUpdated);
        });

        it("should create a product with current date for createdDate and lastUpdated if not provided", async () => {
            const product = Product.create({
                ...validProductData,
                createdDate: undefined,
                lastUpdated: undefined,
            });

            expect(product).toBeInstanceOf(Product);
            const now = new Date();
            expect(product.createdDate.getTime()).toBeLessThanOrEqual(now.getTime());
            expect(product.lastUpdated.getTime()).toBeLessThanOrEqual(now.getTime());
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

        it("should throw an error for description too long", async () => {
            const invalidData = { ...validProductData, description: "a".repeat(10001) };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "description must not exceed 10000 characters"
            );
        });

        it("should accept empty description (optional)", async () => {
            const validData = { ...validProductData, description: "" };
            const product = Product.create(validData);
            expect(product).toBeInstanceOf(Product);
            expect(product.toProps().description).toBe("");
        });

        it("should throw multiple errors for invalid SKU, title and description", async () => {
            const invalidData = { ...validProductData, sku: "", title: "ab", description: "a".repeat(10001) };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toHaveLength(3);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("sku should not be empty");
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "title must be at least 3 characters long"
            );
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "description must not exceed 10000 characters"
            );
        });

        it("should throw an error for invalid image URL", async () => {
            const invalidData = { ...validProductData, image: "not-a-url" };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("image must be a URL address");
        });

        it("should throw an error for image without protocol", async () => {
            const invalidData = { ...validProductData, image: "example.com/image.jpg" };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("image must be a URL address");
        });

        it("should throw multiple errors for all invalid fields", async () => {
            const invalidData = {
                ...validProductData,
                sku: "",
                title: "ab",
                description: "a".repeat(10001),
                image: "not-a-url",
            };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toHaveLength(4);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("sku should not be empty");
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "title must be at least 3 characters long"
            );
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "description must not exceed 10000 characters"
            );
            expect((result as ValidationMultipleErrors).errors).toContainEqual("image must be a URL address");
        });

        it("should throw an error for negative price", async () => {
            const invalidData = { ...validProductData, price: -1 };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("price must not be less than 0");
        });

        it("should throw an error for price exceeding maximum", async () => {
            const invalidData = { ...validProductData, price: 10000 };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("price must not exceed 9999.99");
        });

        it("should throw an error for price with more than 2 decimal places", async () => {
            const invalidData = { ...validProductData, price: 29.999 };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "price must have a maximum of 2 decimal places"
            );
        });

        it("should throw an error for null price", async () => {
            const invalidData = { ...validProductData, price: null };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("price is required");
        });

        it("should accept zero price", async () => {
            const validData = { ...validProductData, price: 0 };
            const product = Product.create(validData);
            expect(product).toBeInstanceOf(Product);
            expect(product.toProps().price).toBe(0);
        });

        it("should accept price with exactly 2 decimal places", async () => {
            const validData = { ...validProductData, price: 1234.56 };
            const product = Product.create(validData);
            expect(product).toBeInstanceOf(Product);
            expect(product.toProps().price).toBe(1234.56);
        });

        it("should throw multiple errors for all invalid fields including price", async () => {
            const invalidData = {
                ...validProductData,
                sku: "",
                title: "ab",
                description: "a".repeat(10001),
                image: "not-a-url",
                price: -5,
            };

            const result = captureError(() => Product.create(invalidData));
            expect(result).toBeInstanceOf(ValidationMultipleErrors);
            expect((result as ValidationMultipleErrors).errors).toHaveLength(5);
            expect((result as ValidationMultipleErrors).errors).toContainEqual("sku should not be empty");
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "title must be at least 3 characters long"
            );
            expect((result as ValidationMultipleErrors).errors).toContainEqual(
                "description must not exceed 10000 characters"
            );
            expect((result as ValidationMultipleErrors).errors).toContainEqual("image must be a URL address");
            expect((result as ValidationMultipleErrors).errors).toContainEqual("price must not be less than 0");
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
