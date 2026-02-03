import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { CategoryDB } from "../categories/data/categories.db";
import { ProductORMRepository } from "./data/products.orm.repository";
import { Repository } from "typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([CategoryDB])],
    providers: [
        {
            provide: ProductORMRepository,
            useFactory: (repository: Repository<Product>) => {
                return new ProductORMRepository(repository);
            },
            inject: [getRepositoryToken(Product)],
        },
        {
            provide: ProductsService,
            useFactory: (
                productRepository: ProductORMRepository,
                productsRepository: Repository<Product>,
                categoriesRepository: Repository<CategoryDB>
            ) => {
                return new ProductsService(productRepository, productsRepository, categoriesRepository);
            },
            inject: [ProductORMRepository, getRepositoryToken(Product), getRepositoryToken(CategoryDB)],
        },
    ],
    controllers: [ProductsController],
})
export class ProductsModule {}
