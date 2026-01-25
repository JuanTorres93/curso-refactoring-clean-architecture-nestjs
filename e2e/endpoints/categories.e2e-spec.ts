import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { setupTestEnvironment } from "../setupTestEnvironment";

describe("Categories endpoint", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestEnvironment();
    });

    afterEach(async () => {
        await app.close();
    });

    it("should return all categories", async () => {
        const loginReq = await request(app.getHttpServer())
            .post("/auth/login")
            .send({ username: "info@xurxodev.com", password: "xurxodev" })
            .expect(200);

        const token = loginReq.body.access_token;

        return request(app.getHttpServer())
            .get("/categories")
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveLength(5);
            });
    });
});
