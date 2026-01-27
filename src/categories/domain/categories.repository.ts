import { Category } from "../categories.entity";

export interface CategoriesRepository {
    get(): Promise<Category[]>;
    getById(uid: string): Promise<Category>;
}
