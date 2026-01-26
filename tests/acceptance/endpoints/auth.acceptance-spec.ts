import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { setupTestEnvironment } from "../common/setupTestEnvironment";
import { loginAndGetToken } from "../../common/loginAndGetToken";

describe("Auth endpoint", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestEnvironment();
    });

    afterEach(async () => {
        await app.close();
    });

    it("should do login, get a JWT then successfully make a call to profile", async () => {
        const token = await loginAndGetToken(app);

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

    it("should receive error to call profile with invalid user", async () => {
        return await request(app.getHttpServer())
            .post("/auth/login")
            .send({ username: "invalid@xurxodev.com", password: "invalid" })
            .expect(401);
    });

    it("should receive unauthorized error to call profile without token", async () => {
        return await request(app.getHttpServer()).get("/auth/profile").expect(401);
    });

    it("should receive unauthorized error to call profile with invalid token", async () => {
        return await request(app.getHttpServer())
            .get("/auth/profile")
            .set("Authorization", "Bearer " + "invalid token")
            .expect(401);
    });
});
