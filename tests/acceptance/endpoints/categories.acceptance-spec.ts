import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { setupTestEnvironment } from "../common/setupTestEnvironment";
import { loginAndGetToken } from "../../common/loginAndGetToken";

describe("Categories endpoint", () => {
    let app: INestApplication;

    beforeEach(async () => {
        app = await setupTestEnvironment();
    });

    afterEach(async () => {
        await app.close();
    });

    it("should do login, get a JWT then successfully make a call to GET categories", async () => {
        const token = await loginAndGetToken(app);

        return request(app.getHttpServer())
            .get("/categories")
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect(({ body }) => {
                expect(body[0].categoryUid).toBe("ele-tvs");
                expect(body[0].name).toBe("TVs");
                expect(body[1].categoryUid).toBe("ele-smartphones");
                expect(body[1].name).toBe("Smartphones");
                expect(body[2].categoryUid).toBe("ele-laptops");
                expect(body[2].name).toBe("Laptops");
                expect(body[3].categoryUid).toBe("ele-tablets");
                expect(body[3].name).toBe("Tablets");
                expect(body[4].categoryUid).toBe("ele-headphones");
                expect(body[4].name).toBe("Headphones");
            });
    });

    it("should receive unauthorized error to call categories without token", async () => {
        return await request(app.getHttpServer()).get("/categories").expect(401);
    });

    it("should receive unauthorized error to call GET categories with invalid token", async () => {
        return await request(app.getHttpServer())
            .get("/categories")
            .set("Authorization", "Bearer " + "invalid token")
            .expect(401);
    });

    it("should do login, get a JWT then successfully make a call to GET category", async () => {
        const token = await loginAndGetToken(app);

        return request(app.getHttpServer())
            .get("/categories/ele-tvs")
            .set("Authorization", "Bearer " + token)
            .expect(200)
            .expect(({ body }) => {
                expect(body.categoryUid).toBe("ele-tvs");
                expect(body.name).toBe("TVs");
            });
    });

    it("should receive unauthorized error to call category without token", async () => {
        return await request(app.getHttpServer()).get("/categories/ele-tvs").expect(401);
    });

    it("should receive unauthorized error to call GET category with invalid token", async () => {
        return await request(app.getHttpServer())
            .get("/categories/ele-tvs")
            .set("Authorization", "Bearer " + "invalid token")
            .expect(401);
    });

    it("should receive not found error to call GET category for non-existing category", async () => {
        const token = await loginAndGetToken(app);

        return request(app.getHttpServer())
            .get("/categories/non-existing-category")
            .set("Authorization", "Bearer " + token)
            .expect(404);
    });
});
