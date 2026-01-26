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
});
