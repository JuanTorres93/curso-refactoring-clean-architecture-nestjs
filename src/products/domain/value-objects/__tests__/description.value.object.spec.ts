import { Description } from "../description.value.object";

describe("Description value object", () => {
    describe("create", () => {
        it("should create a valid Description with correct format", async () => {
            const descriptionValue = "This is a sample product description.";
            const description = Description.create(descriptionValue);
            expect(description).toBeInstanceOf(Description);
            expect(description.value).toBe(descriptionValue);
        });

        it("should trim whitespace from description", async () => {
            const descriptionValue = "  This is a description  ";
            const description = Description.create(descriptionValue);
            expect(description).toBeInstanceOf(Description);
            expect(description.value).toBe("This is a description");
        });

        it("should accept empty description (optional)", async () => {
            const description = Description.create("");
            expect(description).toBeInstanceOf(Description);
            expect(description.value).toBe("");
        });
    });

    describe("validation errors", () => {
        it("should throw an error for description too long", async () => {
            const longDescription = "a".repeat(10001);
            expect(() => Description.create(longDescription)).toThrow("description must not exceed 10000 characters");

            const veryLongDescription = "a".repeat(50000);
            expect(() => Description.create(veryLongDescription)).toThrow(
                "description must not exceed 10000 characters"
            );
        });

        it("should accept description with exactly 10000 characters", async () => {
            const descriptionValue = "a".repeat(10000);
            const description = Description.create(descriptionValue);
            expect(description.value).toBe(descriptionValue);
            expect(description.value.length).toBe(10000);
        });

        it("should accept description with whitespace that becomes empty after trim", async () => {
            const description = Description.create("   ");
            expect(description.value).toBe("");
        });
    });

    describe("equality check", () => {
        it("should return true for equal descriptions", () => {
            const description1 = Description.create("Sample description");
            const description2 = Description.create("Sample description");
            expect(description1.equals(description2)).toBe(true);
        });

        it("should return false for different descriptions", () => {
            const description1 = Description.create("Sample description");
            const description2 = Description.create("Another description");
            expect(description1.equals(description2)).toBe(false);
        });

        it("should return true for descriptions with trimmed whitespace", () => {
            const description1 = Description.create("  Sample description  ");
            const description2 = Description.create("Sample description");
            expect(description1.equals(description2)).toBe(true);
        });
    });
});
