import { Category } from "./categories.entity";
import { CategoriesRepository } from "./categories.repository";

export class GetCategoryUseCase {
    constructor(private readonly categoriesRepository: CategoriesRepository) {}

    async execute(uid: string): Promise<Category> {
        return this.categoriesRepository.getById(uid);
    }
}
