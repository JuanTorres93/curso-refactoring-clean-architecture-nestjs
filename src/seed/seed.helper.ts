import { DataSource } from "typeorm";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app/app.module";
import { seedData } from "./seed.data";

async function runSeeder() {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    await seedData(dataSource);
    await app.close();
}
runSeeder();
