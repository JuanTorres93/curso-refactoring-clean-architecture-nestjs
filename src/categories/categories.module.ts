import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./categories.entity";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoryORMRepository } from "./data/categories.orm.repository";
import { Repository } from "typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [
        {
            provide: CategoryORMRepository,
            useFactory: (repository: Repository<Category>) => {
                return new CategoryORMRepository(repository);
            },
            inject: [getRepositoryToken(Category)],
        },
        {
            provide: CategoriesService,
            useFactory: (categoryRepository: CategoryORMRepository) => {
                return new CategoriesService(categoryRepository);
            },
            inject: [CategoryORMRepository],
        },
    ],
    controllers: [CategoriesController],
})
export class CategoriesModule {}
