import { ResourceNotFoundError } from "../../common/domain/errors";
import { ProductsRepository } from "./products.repository";

export class DeleteProductUseCase {
    constructor(private readonly productsRepository: ProductsRepository) {}

    async execute(sku: string): Promise<void> {
        const product = await this.productsRepository.getBySku(sku);

        if (!product) {
            throw new ResourceNotFoundError(`Product with SKU ${sku} not found`);
        }

        return this.productsRepository.delete(sku);
    }
}
