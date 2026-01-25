import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create.product.dto";
import { Product } from "./products.entity";
import { UpdateProductDto } from "./dto/update.product.dto";
import { Category } from "../categories/categories.entity";
import { ProductsError } from "./products.error";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>
    ) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const category = await this.categoriesRepository.findOneBy({ categoryUid: createProductDto.category });

        if (!category) {
            throw new ProductsError("Category not found");
        }

        const existedProduct = await this.productsRepository.findOneBy({ sku: createProductDto.sku });

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

        return this.productsRepository.save(product);
    }

    async update(sku: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const category = await this.categoriesRepository.findOneBy({ categoryUid: updateProductDto.category });

        if (!category) {
            throw new ProductsError("Category not found");
        }

        const existedProduct = await this.productsRepository.findOneBy({ sku: updateProductDto.sku });

        if (existedProduct && sku != updateProductDto.sku) {
            throw new ProductsError("Duplicate SKU");
        }

        const product = await this.productsRepository.findOneBy({ sku: sku });

        product.sku = updateProductDto.sku;
        product.title = updateProductDto.title;
        product.description = updateProductDto.description;
        product.category = category;
        product.image = updateProductDto.image;
        product.price = updateProductDto.price;
        product.lastUpdated = new Date();

        return this.productsRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return this.productsRepository.find({ relations: ["category"] });
    }

    findOne(sku: string): Promise<Product> {
        return this.productsRepository.findOne({ where: { sku: sku }, relations: ["category"] });
    }

    async remove(sku: string): Promise<void> {
        await this.productsRepository.delete({ sku: sku });
    }
}
