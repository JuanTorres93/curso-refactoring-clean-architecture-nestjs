import { CategoriesRepository } from "../../../categories/domain/categories.repository";
import { ResourceNotFoundError, ValidationDomainError } from "../../../common/domain/errors";
import { ProductProps } from "../products.entity";
import { ProductsRepository } from "../products.repository";

export type UpdateProductParams = Pick<ProductProps, "sku" | "title" | "description" | "image" | "price"> & {
    category: string;
};

export class UpdateProductUseCase {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly categoriesRepository: CategoriesRepository
    ) {}

    async execute(sku: string, params: UpdateProductParams): Promise<ProductProps> {
        const existsProduct = await this.productsRepository.getBySku(sku);

        if (!existsProduct) {
            throw new ResourceNotFoundError("Product not found");
        }

        const category = await this.categoriesRepository.existsById(params.category);

        if (!category) {
            throw new ValidationDomainError("Category not found");
        }

        if (params.sku !== sku) {
            const existSkuToUpdate = await this.productsRepository.existsBySku(params.sku);

            if (existSkuToUpdate) {
                throw new ValidationDomainError("Duplicate SKU");
            }
        }

        const product = await this.productsRepository.getBySku(sku);

        const editedProduct = product.update({
            sku: params.sku,
            title: params.title,
            description: params.description,
            categoryUid: params.category,
            image: params.image,
            price: params.price,
        });

        const savedProduct = await this.productsRepository.save(editedProduct);

        return savedProduct.toProps();
    }
}
