import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryDB } from "../../categories/data/categories.db";
import { ProductDB } from "../data/products.db";
import { ProductORMRepository } from "../data/products.orm.repository";
import { ProductsController } from "./products.controller";
import { ProductsService } from "../products.service";
import { GetProductsUseCase } from "../domain/use-cases/get.products.usecase";
import { GetProductBySkuUseCase } from "../domain/use-cases/get.product.bySku.usecase";
import { DeleteProductUseCase } from "../domain/use-cases/delete.product.usecase";
import { CategoryORMRepository } from "../../categories/data/categories.orm.repository";

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
            provide: ProductsService,
            useFactory: (
                productRepository: ProductORMRepository,
                categoryRepository: CategoryORMRepository,
                productsRepository: Repository<ProductDB>,
                categoriesRepository: Repository<CategoryDB>
            ) => {
                return new ProductsService(
                    productRepository,
                    categoryRepository,
                    productsRepository,
                    categoriesRepository
                );
            },
            inject: [
                ProductORMRepository,
                CategoryORMRepository,
                getRepositoryToken(ProductDB),
                getRepositoryToken(CategoryDB),
            ],
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
