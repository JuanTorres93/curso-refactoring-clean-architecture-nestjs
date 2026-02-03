import { ResourceNotFoundError } from "../../common/domain/errors";
import { Category } from "../domain/categories.entity";
import { CategoriesRepository } from "../domain/categories.repository";
import { CategoryDB } from "./categories.db";

export class CategoryORMRepository implements CategoriesRepository {
    async get(): Promise<Category[]> {
        const categoriesDB = await CategoryDB.find();

        return categoriesDB.map(this.mapToEntity);
    }

    async getById(uid: string): Promise<Category> {
        const categoryDB = await CategoryDB.findOneBy({ categoryUid: uid });

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
