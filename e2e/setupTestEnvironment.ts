import { AuthModule } from "../src/auth/auth.module";
import { CategoriesModule } from "../src/categories/categories.module";
import { ProductsModule } from "../src/products/products.module";
import { UsersModule } from "../src/users/users.module";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "../src/app/app.controller";
import { DataSource } from "typeorm";
import { seedCategories, seedUser } from "../src/seed/seed.data";
import { Product } from "../src/products/products.entity";
import { User } from "../src/users/user.entity";
import { Category } from "../src/categories/categories.entity";
import { ValidationPipe } from "@nestjs/common";

export const setupTestEnvironment = async () => {
    const modRef = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: "mysql",
                host: "127.0.0.1",
                port: 3307,
                username: "root",
                password: "root",
                database: "staging",
                autoLoadEntities: true,
                synchronize: true,
                //logging: true,
            }),
            AuthModule,
            UsersModule,
            ProductsModule,
            CategoriesModule,
        ],
        controllers: [AppController],
        providers: [],
    }).compile();

    const app = modRef.createNestApplication();

    await app.init();

    app.useGlobalPipes(new ValidationPipe());

    const dataSource = app.get(DataSource);

    await resetDatabase(dataSource);

    return app;
};

async function resetDatabase(dataSource: DataSource): Promise<void> {
    await deleteProducts(dataSource);

    await seedUserIfRequired(dataSource);

    await seedCategoriesIfRequired(dataSource);
}

async function deleteProducts(dataSource: DataSource) {
    const productsRepository = dataSource.getRepository(Product);
    await productsRepository.delete({});
}

async function seedUserIfRequired(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.find();

    if (users.length == 0) {
        await seedUser(dataSource);
    }
}

async function seedCategoriesIfRequired(dataSource: DataSource) {
    const categoriesRepository = dataSource.getRepository(Category);
    const categories = await categoriesRepository.find();

    if (categories.length == 0) {
        await seedCategories(dataSource);
    }
}
