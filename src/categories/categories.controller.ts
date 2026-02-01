import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ResourceNotFoundError } from "./domain/categories.repository";
import { GetCategoriesUseCase } from "./domain/get.categories.usecase";
import { GetCategoryUseCase } from "./domain/get.category.usecase";
import { CategoryResponseDto } from "./dto/response.category.dto";

@Controller("categories")
export class CategoriesController {
    constructor(
        private readonly getCategoriesUseCase: GetCategoriesUseCase,
        private readonly getCategoryUseCase: GetCategoryUseCase
    ) {}

    @Get()
    async get(): Promise<CategoryResponseDto[]> {
        const categories = await this.getCategoriesUseCase.execute();

        return plainToInstance(CategoryResponseDto, categories, { excludeExtraneousValues: true });
    }

    @Get(":categoryUid")
    async getById(@Param("categoryUid") categoryUid: string): Promise<CategoryResponseDto> {
        try {
            const category = await this.getCategoryUseCase.execute(categoryUid);

            return plainToInstance(CategoryResponseDto, category, { excludeExtraneousValues: true });
        } catch (error) {
            if (error instanceof ResourceNotFoundError) {
                throw new NotFoundException();
            }
            throw error;
        }
    }
}
