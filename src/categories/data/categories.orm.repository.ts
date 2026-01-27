import { Repository, W } from "typeorm";
import { Category } from "../domain/categories.entity";
import { CategoriesRepository, ResourceNotFoundError } from "../domain/categories.repository";
import { CategoryDB } from "./categories.db";

export class CategoryORMRepository implements CategoriesRepository {
    constructor(private readonly categoriesRepository: Repository<CategoryDB>) {}

    async get(): Promise<Category[]> {
        const categoriesDB = await this.categoriesRepository.find();

        return categoriesDB.map(this.mapToEntity);
    }

    async getById(uid: string): Promise<Category> {
        const categoryDB = await this.categoriesRepository.findOneBy({ categoryUid: uid });

        if (!categoryDB) {
            throw new ResourceNotFoundError("Category not found");
        }

        return this.mapToEntity(categoryDB);
    }

    private mapToEntity(categoryDB: CategoryDB): Category {
        return new Category({
            categoryUid: categoryDB.categoryUid,
            name: categoryDB.name,
        });
    }
}
