import { Repository } from "typeorm";
import { ProductsRepository } from "../domain/products.repository";
import { Product } from "../products.entity";

export class ProductORMRepository implements ProductsRepository {
    constructor(private readonly productsRepository: Repository<Product>) {}

    async get(): Promise<Product[]> {
        return this.productsRepository.find({
            relations: {
                category: true,
            },
        });
    }
}
