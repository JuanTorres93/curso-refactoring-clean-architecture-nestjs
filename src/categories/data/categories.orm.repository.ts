import { Repository } from "typeorm";
import { Category } from "../categories.entity";
import { CategoriesRepository } from "../domain/categories.repository";

export class CategoryORMRepository implements CategoriesRepository {
    constructor(private readonly categoriesRepository: Repository<Category>) {}

    async get(): Promise<Category[]> {
        return this.categoriesRepository.find();
    }

    async getById(uid: string): Promise<Category> {
        return this.categoriesRepository.findOneBy({ categoryUid: uid });
    }
}
