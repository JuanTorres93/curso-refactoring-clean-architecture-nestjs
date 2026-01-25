import { INestApplication } from "@nestjs/common";
import request from "supertest";

export async function loginAndGetToken(app: INestApplication) {
    const loginReq = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ username: "info@xurxodev.com", password: "xurxodev" })
        .expect(200);

    const token = loginReq.body.access_token;
    return token;
}
