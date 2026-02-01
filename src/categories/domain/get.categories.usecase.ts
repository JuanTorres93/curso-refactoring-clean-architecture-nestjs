import { Category } from "./categories.entity";
import { CategoriesRepository } from "./categories.repository";

export class GetCategoriesUseCase {
    constructor(private readonly categoriesRepository: CategoriesRepository) {}

    async execute(): Promise<Category[]> {
        return this.categoriesRepository.get();
    }
}
