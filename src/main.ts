import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(8085);
    console.debug(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
