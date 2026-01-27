import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { plainToInstance } from "class-transformer";
import { CategoryResponseDto } from "./dto/response.category.dto";

@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    async get(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoriesService.get();

        return plainToInstance(CategoryResponseDto, categories, { excludeExtraneousValues: true });
    }

    @Get(":sku")
    async getById(@Param("sku") sku: string): Promise<CategoryResponseDto> {
        const category = await this.categoriesService.getById(sku);

        if (!category) {
            throw new NotFoundException();
        }

        return plainToInstance(CategoryResponseDto, category, { excludeExtraneousValues: true });
    }
}
