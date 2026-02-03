import { Product } from "./products.entity";
import { ProductsRepository } from "./products.repository";

export class GetProductBySkuUseCase {
    constructor(private readonly productsRepository: ProductsRepository) {}

    async execute(sku: string): Promise<Product> {
        return this.productsRepository.getBySku(sku);
    }
}
