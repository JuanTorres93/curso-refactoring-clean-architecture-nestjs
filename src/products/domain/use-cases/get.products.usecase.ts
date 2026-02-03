import { ProductProps } from "../products.entity";
import { ProductsRepository } from "../products.repository";

export class GetProductsUseCase {
    constructor(private readonly productsRepository: ProductsRepository) {}

    async execute(): Promise<ProductProps[]> {
        const products = await this.productsRepository.get();

        return products.map(product => product.toProps());
    }
}
