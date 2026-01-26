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

    describe("GET all", () => {
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

    describe("GET", () => {
        beforeEach(async () => {
            const token = await loginAndGetToken(app);

            await request(app.getHttpServer())
                .post("/products")
                .set("Authorization", "Bearer " + token)
                .send(product);
        });

        it("should do login, get a JWT then successfully make a call to GET product", async () => {
            const token = await loginAndGetToken(app);

            return request(app.getHttpServer())
                .get(`/products/${product.sku}`)
                .set("Authorization", "Bearer " + token)
                .expect(200)
                .expect(({ body }) => {
                    expect(body.sku).toBe(product.sku);
                    expect(body.title).toBe(product.title);
                    expect(body.description).toBe(product.description);
                    expect(body.category).toBe(product.category);
                    expect(body.image).toBe(product.image);
                    expect(body.price).toBe(product.price);
                    expect(body.createdDate).toBeDefined();
                    expect(body.lastUpdated).toBeDefined();
                });
        });

        it("should receive unauthorized error to call product without token", async () => {
            return await request(app.getHttpServer()).get(`/products/${product.sku}`).expect(401);
        });

        it("should receive unauthorized error to call GET product with invalid token", async () => {
            return await request(app.getHttpServer())
                .get(`/products/${product.sku}`)
                .set("Authorization", "Bearer " + "invalid token")
                .expect(401);
        });

        it("should return 404 for non existing product", async () => {
            const token = await loginAndGetToken(app);

            return request(app.getHttpServer())
                .get(`/products/invalid-sku`)
                .set("Authorization", "Bearer " + token)
                .expect(404);
        });
    });
});

const product = {
    sku: "TVS_L55_4k",
    title: 'LG 55UR78006LK 55", 4K UHD, Smart TV, HDR10, webOS23, Serie 78, Procesador Alta Potencia, Dolby Digital Plus, Alexa/Google Assistant',
    description:
        "La resolución 4K UHDte permite ver imágenes muy nítidas. Esto hace posible ver claramente los números en la parte trasera de los miembros de tu equipo durante un partido de deportes. Gracias al soporte HDR10+, puedes ver imágenes brillantes con muchos colores. Por ejemplo, en una escena de playa, la luz alrededor de una sombrilla es tan brillante que casi puedes sentirlo, mientras que el color rojo de un cóctel resalta en tu televisor. Debido a la profundidad de color de 10 bits, puedes ver 1 mil millones de colores. En un atardecer, esto te permite ver muchos tonos de naranja y rojo que se mezclan suavemente.",
    category: "ele-tvs",
    image: "https://m.media-amazon.com/images/I/91yCmSEq0AL._AC_SX679_.jpg",
    price: 429.59,
};
