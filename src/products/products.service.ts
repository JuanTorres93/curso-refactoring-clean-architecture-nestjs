import { Repository } from "typeorm";
import { CategoryDB } from "../categories/data/categories.db";
import { CategoriesRepository } from "../categories/domain/categories.repository";
import { ProductDB } from "./data/products.db";
import { Product } from "./domain/products.entity";
import { ProductsRepository } from "./domain/products.repository";
import { UpdateProductDto } from "./dto/update.product.dto";
import { ProductsError } from "./products.error";

export type CreateProductParams = {
    sku: string;
    title: string;
    description?: string;
    category?: string;
    image?: string;
    price: number;
};

export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly categoriesRepository: CategoriesRepository,

        /**
         * @deprecated use categoriesRepository instead
         */
        private readonly productsORMRepository: Repository<ProductDB>,

        /**
         * @deprecated use categoriesRepository instead
         */
        private readonly categoriesORMRepository: Repository<CategoryDB>
    ) {}

    async update(sku: string, updateProductDto: UpdateProductDto): Promise<ProductDB> {
        const category = await this.categoriesORMRepository.findOneBy({ categoryUid: updateProductDto.category });

        if (!category) {
            throw new ProductsError("Category not found");
        }

        const existedProduct = await this.productsORMRepository.findOneBy({ sku: updateProductDto.sku });

        if (existedProduct && sku != updateProductDto.sku) {
            throw new ProductsError("Duplicate SKU");
        }

        const product = await this.productsORMRepository.findOneBy({ sku: sku });

        product.sku = updateProductDto.sku;
        product.title = updateProductDto.title;
        product.description = updateProductDto.description;
        product.category = category;
        product.image = updateProductDto.image;
        product.price = updateProductDto.price;
        product.lastUpdated = new Date();

        return this.productsORMRepository.save(product);
    }

    /**
     *
     * @deprecated use productsRepository instead
     */
    findOne(sku: string): Promise<ProductDB> {
        return this.productsORMRepository.findOne({ where: { sku: sku }, relations: ["category"] });
    }
}
