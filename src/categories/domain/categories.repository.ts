import { Category } from "./categories.entity";

export class DomainError extends Error {}
export class ResourceNotFoundError extends DomainError {}

export interface CategoriesRepository {
    get(): Promise<Category[]>;
    getById(uid: string): Promise<Category>;
}
