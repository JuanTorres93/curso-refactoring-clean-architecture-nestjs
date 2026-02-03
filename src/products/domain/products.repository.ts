import { Product } from "./products.entity";

export interface ProductsRepository {
    get(): Promise<Product[]>;
    getBySku(sku: string): Promise<Product>;
}
