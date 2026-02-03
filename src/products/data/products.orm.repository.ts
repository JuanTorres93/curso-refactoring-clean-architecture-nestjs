import { Repository } from "typeorm";
import { ProductsRepository } from "../domain/products.repository";
import { Product } from "../domain/products.entity";
import { ProductDB } from "./products.db";
import { ResourceNotFoundError } from "../../common/domain/errors";

export class ProductORMRepository implements ProductsRepository {
    constructor(private readonly productsRepository: Repository<ProductDB>) {}

    async get(): Promise<Product[]> {
        const productsDB = await this.productsRepository.find({
            relations: {
                category: true,
            },
        });

        return productsDB.map(productDB => this.mapToEntity(productDB));
    }

    async getBySku(sku: string): Promise<Product> {
        const productDB = await this.productsRepository.findOne({
            where: { sku },
            relations: {
                category: true,
            },
        });

        if (!productDB) {
            throw new ResourceNotFoundError(`Product not found`);
        }

        return this.mapToEntity(productDB);
    }

    private mapToEntity(dbProduct: ProductDB): Product {
        return new Product({
            sku: dbProduct.sku,
            title: dbProduct.title,
            description: dbProduct.description,
            categoryUid: dbProduct.category.categoryUid,
            image: dbProduct.image,
            price: dbProduct.price,
            createdDate: dbProduct.createdDate,
            lastUpdated: dbProduct.lastUpdated,
        });
    }
}
