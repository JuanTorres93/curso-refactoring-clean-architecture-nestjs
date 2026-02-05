import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryDB } from "../../categories/data/categories.db";
import { CategoryORMRepository } from "../../categories/data/categories.orm.repository";
import { ProductDB } from "../data/products.db";
import { ProductORMRepository } from "../data/products.orm.repository";
import { CreateProductUseCase } from "../domain/use-cases/create.product.usecase";
import { DeleteProductUseCase } from "../domain/use-cases/delete.product.usecase";
import { GetProductBySkuUseCase } from "../domain/use-cases/get.product.bySku.usecase";
import { GetProductsUseCase } from "../domain/use-cases/get.products.usecase";
import { UpdateProductUseCase } from "../domain/use-cases/update.product.usecase";
import { ProductsController } from "./products.controller";

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
            provide: CategoryORMRepository,
            useFactory: () => {
                return new CategoryORMRepository();
            },
            inject: [getRepositoryToken(CategoryDB)],
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
        {
            provide: CreateProductUseCase,
            useFactory: (productRepository: ProductORMRepository, categoryRepository: CategoryORMRepository) => {
                return new CreateProductUseCase(productRepository, categoryRepository);
            },
            inject: [ProductORMRepository, CategoryORMRepository],
        },
        {
            provide: UpdateProductUseCase,
            useFactory: (productRepository: ProductORMRepository, categoryRepository: CategoryORMRepository) => {
                return new UpdateProductUseCase(productRepository, categoryRepository);
            },
            inject: [ProductORMRepository, CategoryORMRepository],
        },
    ],
    controllers: [ProductsController],
})
export class ProductsModule {}
