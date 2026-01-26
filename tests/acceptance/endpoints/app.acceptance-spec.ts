import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { setupTestEnvironment } from "../common/setupTestEnvironment";

describe("Root endpoint", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestEnvironment();
    });

    afterEach(async () => {
        await app.close();
    });

    it("should return the welcome message", async () => {
        request(app.getHttpServer())
            .get("/")
            .expect(200)
            .expect(({ body }) => {
                expect(body.username).toBe("Refactoring Clean Architecture NestJS Server!");
            });
    });
});
