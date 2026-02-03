import { ProductProps } from "../products.entity";
import { ProductsRepository } from "../products.repository";

export class GetProductBySkuUseCase {
    constructor(private readonly productsRepository: ProductsRepository) {}

    async execute(sku: string): Promise<ProductProps> {
        const product = await this.productsRepository.getBySku(sku);

        return product.toProps();
    }
}
