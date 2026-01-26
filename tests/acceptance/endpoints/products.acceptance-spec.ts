import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { setupTestEnvironment } from "../common/setupTestEnvironment";
import { loginAndGetToken } from "../../common/loginAndGetToken";

describe("Products endpoint", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestEnvironment();
    });

    afterEach(async () => {
        await app.close();
    });

    it("should do login, get a JWT then successfully make a call to GET products", async () => {
        const token = await loginAndGetToken(app);

        return request(app.getHttpServer())
            .get("/products")
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect(({ body }) => {
                expect(body.length).toBe(0);
            });
    });

    it("should receive unauthorized error to call products without token", async () => {
        return await request(app.getHttpServer()).get("/products").expect(401);
    });

    it("should receive unauthorized error to call GET products with invalid token", async () => {
        return await request(app.getHttpServer())
            .get("/products")
            .set("Authorization", "Bearer " + "invalid token")
            .expect(401);
    });
});
