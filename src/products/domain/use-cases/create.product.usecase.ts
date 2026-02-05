import { Product, ProductProps } from "../products.entity";
import { ProductsRepository } from "../products.repository";
import { CategoriesRepository } from "../../../categories/domain/categories.repository";
import { ValidationDomainError } from "../../../common/domain/errors";

export type CreateProductParams = Pick<ProductProps, "sku" | "title" | "description" | "image" | "price"> & {
    category: string;
};

export class CreateProductUseCase {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly categoriesRepository: CategoriesRepository
    ) {}

    async execute(params: CreateProductParams): Promise<ProductProps> {
        const categoryExists = await this.categoriesRepository.existsById(params.category);

        if (!categoryExists) {
            throw new ValidationDomainError("Category not found");
        }

        const productExists = await this.productsRepository.existsBySku(params.sku);

        if (productExists) {
            throw new ValidationDomainError("Duplicate SKU");
        }

        const product = Product.create({
            sku: params.sku,
            title: params.title,
            description: params.description,
            categoryUid: params.category,
            image: params.image,
            price: params.price,
        });

        const savedProduct = await this.productsRepository.save(product);

        return savedProduct.toProps();
    }
}
