import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryDB } from "../../categories/data/categories.db";
import { ProductDB } from "../data/products.db";
import { ProductORMRepository } from "../data/products.orm.repository";
import { ProductsController } from "./products.controller";
import { ProductsService } from "../products.service";
import { GetProductsUseCase } from "../domain/get.products.usecase";
import { GetProductBySkuUseCase } from "../domain/get.product.bySku.usecase";
import { DeleteProductUseCase } from "../domain/delete.product.usecase";

@Module({
    imports: [TypeOrmModule.forFeature([ProductDB]), TypeOrmModule.forFeature([CategoryDB])],
    providers: [
        {
            provide: ProductORMRepository,
            useFactory: (repository: Repository<ProductDB>) => {
                return new ProductORMRepository(repository);
            },
            inject: [getRepositoryToken(ProductDB)],
        },
        {
            provide: ProductsService,
            useFactory: (
                productRepository: ProductORMRepository,
                productsRepository: Repository<ProductDB>,
                categoriesRepository: Repository<CategoryDB>
            ) => {
                return new ProductsService(productRepository, productsRepository, categoriesRepository);
            },
            inject: [ProductORMRepository, getRepositoryToken(ProductDB), getRepositoryToken(CategoryDB)],
        },
        {
            provide: GetProductsUseCase,
            useFactory: (productRepository: ProductORMRepository) => {
                return new GetProductsUseCase(productRepository);
            },
            inject: [ProductORMRepository],
        },
        {
            provide: GetProductBySkuUseCase,
            useFactory: (productRepository: ProductORMRepository) => {
                return new GetProductBySkuUseCase(productRepository);
            },
            inject: [ProductORMRepository],
        },
        {
            provide: DeleteProductUseCase,
            useFactory: (productRepository: ProductORMRepository) => {
                return new DeleteProductUseCase(productRepository);
            },
            inject: [ProductORMRepository],
        },
    ],
    controllers: [ProductsController],
})
export class ProductsModule {}
