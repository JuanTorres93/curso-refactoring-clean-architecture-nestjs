import { Product } from "./products.entity";
import { ProductsRepository } from "./products.repository";

export class GetProductsUseCase {
    constructor(private readonly productsRepository: ProductsRepository) {}

    async execute(): Promise<Product[]> {
        return this.productsRepository.get();
    }
}
