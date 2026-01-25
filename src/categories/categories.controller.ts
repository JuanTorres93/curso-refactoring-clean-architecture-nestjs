import { Controller, Get, Param } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { plainToInstance } from "class-transformer";
import { CategoryResponseDto } from "./dto/response.category.dto";

@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    async findAll(): Promise<CategoryResponseDto[]> {
        const categories = await this.categoriesService.findAll();

        return plainToInstance(CategoryResponseDto, categories, { excludeExtraneousValues: true });
    }

    @Get(":sku")
    async findOne(@Param("sku") sku: string): Promise<CategoryResponseDto> {
        const category = await this.categoriesService.findOne(sku);

        return plainToInstance(CategoryResponseDto, category, { excludeExtraneousValues: true });
    }
}
