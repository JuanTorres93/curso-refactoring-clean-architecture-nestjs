import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoryDB } from "./data/categories.db";
import { CategoryORMRepository } from "./data/categories.orm.repository";

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
            provide: CategoriesService,
            useFactory: categoryRepository => {
                return new CategoriesService(categoryRepository);
            },
            inject: [CategoryORMRepository],
        },
    ],
    controllers: [CategoriesController],
})
export class CategoriesModule {}
