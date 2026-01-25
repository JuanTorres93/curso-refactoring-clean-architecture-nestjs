import { DataSource } from "typeorm";
import { User } from "../users/user.entity";
import { Category } from "../categories/categories.entity";

export async function seedData(dataSource: DataSource): Promise<void> {
    try {
        await resetDatabase(dataSource);

        await seedUser(dataSource);
        await seedCategories(dataSource);
    } catch (error) {
        console.error(error);
    }
}

export async function resetDatabase(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
        await queryRunner.clearDatabase();
        await dataSource.synchronize();
    } finally {
        await queryRunner.release();
    }
}

export async function seedUser(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    const user = userRepository.create({
        firstName: "Jorge",
        lastName: "Sánchez Fernández",
        username: "info@xurxodev.com",
        password: "xurxodev",
    });

    await userRepository.save(user);
}

export async function seedCategories(dataSource: DataSource) {
    const categoryRepository = dataSource.getRepository(Category);

    const tvCategory = categoryRepository.create({
        categoryUid: "ele-tvs",
        name: "TVs",
    });

    await categoryRepository.save(tvCategory);

    const smartphonesCategory = categoryRepository.create({
        categoryUid: "ele-smartphones",
        name: "Smartphones",
    });

    await categoryRepository.save(smartphonesCategory);

    const laptopsCategory = categoryRepository.create({
        categoryUid: "ele-laptops",
        name: "Laptops",
    });

    await categoryRepository.save(laptopsCategory);

    const tabletsCategory = categoryRepository.create({
        categoryUid: "ele-tablets",
        name: "Tablets",
    });

    await categoryRepository.save(tabletsCategory);

    const headphonesCategory = categoryRepository.create({
        categoryUid: "ele-headphones",
        name: "Headphones",
    });

    await categoryRepository.save(headphonesCategory);
}
