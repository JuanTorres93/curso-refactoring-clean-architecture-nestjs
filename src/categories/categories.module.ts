import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesController } from "./categories.controller";
import { CategoryDB } from "./data/categories.db";
import { CategoryORMRepository } from "./data/categories.orm.repository";
import { GetCategoriesUseCase } from "./domain/get.categories.usecase";
import { GetCategoryUseCase } from "./domain/get.category.usecase";

@Module({
    imports: [TypeOrmModule.forFeature([CategoryDB])],
    providers: [
        {
            provide: CategoryORMRepository,
            useFactory: categoryRepository => {
                return new CategoryORMRepository(categoryRepository);
            },
            inject: [getRepositoryToken(CategoryDB)],
        },
        {
            provide: GetCategoriesUseCase,
            useFactory: categoryRepository => {
                return new GetCategoriesUseCase(categoryRepository);
            },
            inject: [CategoryORMRepository],
        },
        {
            provide: GetCategoryUseCase,
            useFactory: categoryRepository => {
                return new GetCategoryUseCase(categoryRepository);
            },
            inject: [CategoryORMRepository],
        },
    ],
    controllers: [CategoriesController],
})
export class CategoriesModule {}
