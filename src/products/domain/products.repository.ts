import { Product } from "../products.entity";

export class DomainError extends Error {}
export class ResourceNotFoundError extends DomainError {}

export interface ProductsRepository {
    get(): Promise<Product[]>;
}
