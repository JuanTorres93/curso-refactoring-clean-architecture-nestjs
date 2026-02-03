import { Repository } from "typeorm";
import { CategoryDB } from "../categories/data/categories.db";
import { ProductsRepository } from "./domain/products.repository";
import { CreateProductDto } from "./dto/create.product.dto";
import { UpdateProductDto } from "./dto/update.product.dto";
import { Product } from "./products.entity";
import { ProductsError } from "./products.error";

export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,

        /**
         * @deprecated use categoriesRepository instead
         */
        private readonly productsORMRepository: Repository<Product>,

        /**
         * @deprecated use categoriesRepository instead
         */
        private readonly categoriesORMRepository: Repository<CategoryDB>
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const category = await this.categoriesORMRepository.findOneBy({ categoryUid: createProductDto.category });

        if (!category) {
            throw new ProductsError("Category not found");
        }

        const existedProduct = await this.productsORMRepository.findOneBy({ sku: createProductDto.sku });

        if (existedProduct) {
            throw new ProductsError("Duplicate SKU");
        }

        const product = new Product();

        product.sku = createProductDto.sku;
        product.title = createProductDto.title;
        product.description = createProductDto.description;
        product.category = category;
        product.image = createProductDto.image;
        product.price = createProductDto.price;
        product.createdDate = new Date();
        product.lastUpdated = new Date();

        return this.productsORMRepository.save(product);
    }

    async update(sku: string, updateProductDto: UpdateProductDto): Promise<Product> {
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

    async get(): Promise<Product[]> {
        return this.productsRepository.get();
    }

    findOne(sku: string): Promise<Product> {
        return this.productsORMRepository.findOne({ where: { sku: sku }, relations: ["category"] });
    }

    async remove(sku: string): Promise<void> {
        await this.productsORMRepository.delete({ sku: sku });
    }
}
