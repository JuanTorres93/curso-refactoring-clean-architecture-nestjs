import { Title } from "../title.value.object";

describe("Title value object", () => {
    describe("create", () => {
        it("should create a valid Title with correct format", async () => {
            const titleValue = "Sample Product";
            const title = Title.create(titleValue);
            expect(title).toBeInstanceOf(Title);
            expect(title.value).toBe(titleValue);
        });

        it("should trim whitespace from title", async () => {
            const titleValue = "  Sample Product  ";
            const title = Title.create(titleValue);
            expect(title).toBeInstanceOf(Title);
            expect(title.value).toBe("Sample Product");
        });
    });

    describe("validation errors", () => {
        it("should throw an error for empty title", async () => {
            expect(() => Title.create("")).toThrow("title should not be empty");
            expect(() => Title.create("   ")).toThrow("title should not be empty");
            expect(() => Title.create(null)).toThrow("title should not be empty");
            expect(() => Title.create(undefined)).toThrow("title should not be empty");
        });

        it("should throw an error for title too short", async () => {
            expect(() => Title.create("ab")).toThrow("title must be at least 3 characters long");
            expect(() => Title.create("a")).toThrow("title must be at least 3 characters long");
            expect(() => Title.create("  ab  ")).toThrow("title must be at least 3 characters long");
        });

        it("should throw an error for title too long", async () => {
            const longTitle = "a".repeat(256);
            expect(() => Title.create(longTitle)).toThrow("title must not exceed 255 characters");

            const veryLongTitle = "a".repeat(1000);
            expect(() => Title.create(veryLongTitle)).toThrow("title must not exceed 255 characters");
        });

        it("should accept title with exactly 3 characters", async () => {
            const title = Title.create("abc");
            expect(title.value).toBe("abc");
        });

        it("should accept title with exactly 255 characters", async () => {
            const titleValue = "a".repeat(255);
            const title = Title.create(titleValue);
            expect(title.value).toBe(titleValue);
            expect(title.value.length).toBe(255);
        });
    });

    describe("equality check", () => {
        it("should return true for equal titles", () => {
            const title1 = Title.create("Sample Product");
            const title2 = Title.create("Sample Product");
            expect(title1.equals(title2)).toBe(true);
        });

        it("should return false for different titles", () => {
            const title1 = Title.create("Sample Product");
            const title2 = Title.create("Another Product");
            expect(title1.equals(title2)).toBe(false);
        });

        it("should return true for titles with trimmed whitespace", () => {
            const title1 = Title.create("  Sample Product  ");
            const title2 = Title.create("Sample Product");
            expect(title1.equals(title2)).toBe(true);
        });
    });
});
