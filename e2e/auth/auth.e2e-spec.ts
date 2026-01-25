import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { setupTestEnvironment } from "../setupTestEnvironment";

describe("E2E JWT Sample", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestEnvironment();
    });

    afterEach(async () => {
        await app.close();
    });

    it("should get a JWT then successfully make a call", async () => {
        const loginReq = await request(app.getHttpServer())
            .post("/auth/login")
            .send({ username: "info@xurxodev.com", password: "xurxodev" })
            .expect(200);

        const token = loginReq.body.access_token;

        return request(app.getHttpServer())
            .get("/auth/profile")
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect(({ body }) => {
                expect(body.username).toBe("info@xurxodev.com");
                expect(body.firstName).toBe("Jorge");
                expect(body.lastName).toBe("Sánchez Fernández");
                expect(body.isActive).toBe(true);
            });
    });
});
