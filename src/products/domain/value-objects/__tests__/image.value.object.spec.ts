import { Image } from "../image.value.object";

describe("Image value object", () => {
    describe("create", () => {
        it("should create a valid Image with correct URL format", async () => {
            const imageValue = "http://example.com/image.jpg";
            const image = Image.create(imageValue);
            expect(image).toBeInstanceOf(Image);
            expect(image.value).toBe(imageValue);
        });

        it("should create a valid Image with HTTPS URL", async () => {
            const imageValue = "https://example.com/image.png";
            const image = Image.create(imageValue);
            expect(image).toBeInstanceOf(Image);
            expect(image.value).toBe(imageValue);
        });

        it("should trim whitespace from image URL", async () => {
            const imageValue = "  http://example.com/image.jpg  ";
            const image = Image.create(imageValue);
            expect(image).toBeInstanceOf(Image);
            expect(image.value).toBe("http://example.com/image.jpg");
        });
    });

    describe("validation errors", () => {
        it("should throw an error for invalid URL format (no protocol)", async () => {
            const invalidUrls = [
                "example.com/image.jpg",
                "www.example.com/image.jpg",
                "ftp://example.com/image.jpg",
                "//example.com/image.jpg",
            ];

            for (const invalidUrl of invalidUrls) {
                expect(() => Image.create(invalidUrl)).toThrow("image must be a URL address");
            }
        });

        it("should throw an error for invalid URL format (malformed)", async () => {
            const invalidUrls = ["not-a-url", "http://", "https://", "just some text"];

            for (const invalidUrl of invalidUrls) {
                expect(() => Image.create(invalidUrl)).toThrow("image must be a URL address");
            }
        });

        it("should accept valid URLs with paths and query strings", async () => {
            const validUrls = [
                "http://example.com/path/to/image.jpg",
                "https://example.com/image.png?size=large",
                "http://cdn.example.com/images/product.jpg",
                "https://www.example.com/assets/image.jpg#section",
            ];

            for (const validUrl of validUrls) {
                const image = Image.create(validUrl);
                expect(image.value).toBe(validUrl);
            }
        });
    });

    describe("equality check", () => {
        it("should return true for equal image URLs", () => {
            const image1 = Image.create("http://example.com/image.jpg");
            const image2 = Image.create("http://example.com/image.jpg");
            expect(image1.equals(image2)).toBe(true);
        });

        it("should return false for different image URLs", () => {
            const image1 = Image.create("http://example.com/image1.jpg");
            const image2 = Image.create("http://example.com/image2.jpg");
            expect(image1.equals(image2)).toBe(false);
        });

        it("should return true for image URLs with trimmed whitespace", () => {
            const image1 = Image.create("  http://example.com/image.jpg  ");
            const image2 = Image.create("http://example.com/image.jpg");
            expect(image1.equals(image2)).toBe(true);
        });
    });
});
