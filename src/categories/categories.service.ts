import { Category } from "./domain/categories.entity";
import { CategoriesRepository } from "./domain/categories.repository";

export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) {}

    async get(): Promise<Category[]> {
        return this.categoriesRepository.get();
    }

    async getById(uid: string): Promise<Category> {
        return this.categoriesRepository.getById(uid);
    }
}
