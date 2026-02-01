import { DynamicModule, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppController } from "../../src/app/app.controller";
import { AuthModule } from "../../src/auth/auth.module";
import { CategoriesModule } from "../../src/categories/api/categories.module";
import { Product } from "../../src/products/products.entity";
import { ProductsModule } from "../../src/products/products.module";
import { seedCategories, seedUser } from "../../src/seed/seed.data";
import { User } from "../../src/users/user.entity";
import { UsersModule } from "../../src/users/users.module";
import { DataSource } from "typeorm";
import { CategoryDB } from "../../src/categories/data/categories.db";

export const createAppAndResetDatabase = async (typeORMModule: DynamicModule) => {
    const modRef = await Test.createTestingModule({
        imports: [typeORMModule, AuthModule, UsersModule, ProductsModule, CategoriesModule],
        controllers: [AppController],
        providers: [],
    }).compile();

    const app = modRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();

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
    const categoriesRepository = dataSource.getRepository(CategoryDB);
    const categories = await categoriesRepository.find();

    if (categories.length == 0) {
        await seedCategories(dataSource);
    }
}
