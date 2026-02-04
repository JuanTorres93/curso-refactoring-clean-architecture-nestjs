import { Repository } from "typeorm";
import { ProductsRepository } from "../domain/products.repository";
import { Product } from "../domain/products.entity";
import { ProductDB } from "./products.db";
import { ResourceNotFoundError } from "../../common/domain/errors";
import { CategoryDB } from "../../categories/data/categories.db";

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

    async delete(sku: string): Promise<void> {
        await this.productsRepository.delete({ sku });
    }

    async save(product: Product): Promise<Product> {
        const categoryDB = await CategoryDB.findOneBy({ categoryUid: product.categoryUid });

        if (!categoryDB) {
            throw new ResourceNotFoundError(`Category not found`);
        }

        const productDB = this.mapToDB(product, categoryDB);

        const savedProductDB = await this.productsRepository.save(productDB);

        return this.mapToEntity(savedProductDB);
    }

    async existsBySku(sku: string): Promise<boolean> {
        try {
            await this.getBySku(sku);
            return true;
        } catch {
            return false;
        }
    }

    private mapToEntity(dbProduct: ProductDB): Product {
        return Product.create({
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

    private mapToDB(product: Product, categoryDB: CategoryDB): ProductDB {
        const productDB = new ProductDB();

        productDB.sku = product.sku.value;
        productDB.title = product.title.value;
        productDB.description = product.description.value;
        productDB.category = categoryDB;
        productDB.image = product.image.value;
        productDB.price = product.price.value;
        productDB.createdDate = product.createdDate;
        productDB.lastUpdated = product.lastUpdated;

        return productDB;
    }
}
