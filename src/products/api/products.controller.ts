import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ResourceNotFoundError, ValidationDomainError, ValidationMultipleErrors } from "../../common/domain/errors";
import { CreateProductUseCase } from "../domain/use-cases/create.product.usecase";
import { DeleteProductUseCase } from "../domain/use-cases/delete.product.usecase";
import { GetProductBySkuUseCase } from "../domain/use-cases/get.product.bySku.usecase";
import { GetProductsUseCase } from "../domain/use-cases/get.products.usecase";
import { UpdateProductUseCase } from "../domain/use-cases/update.product.usecase";
import { UpdateProductDto } from "./dto/update.product.dto";
import { CreateProductDto } from "./dto/create.product.dto";
import { ProductResponseDto } from "./dto/response.product.dto";

@Controller("products")
export class ProductsController {
    constructor(
        private readonly getProductsUseCase: GetProductsUseCase,
        private readonly getProductBySkuUseCase: GetProductBySkuUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase
    ) {}

    @Get()
    async get(): Promise<ProductResponseDto[]> {
        const products = await this.getProductsUseCase.execute();

        return plainToInstance(ProductResponseDto, products, { excludeExtraneousValues: true });
    }

    @Get(":sku")
    async getBySku(@Param("sku") sku: string): Promise<ProductResponseDto> {
        try {
            const product = await this.getProductBySkuUseCase.execute(sku);

            return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post()
    async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        try {
            const product = await this.createProductUseCase.execute(createProductDto);

            return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
        } catch (error) {
            this.handleError(error);
        }
    }

    @Put(":sku")
    async update(@Param("sku") sku: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        try {
            const updatedProduct = await this.updateProductUseCase.execute(sku, updateProductDto);

            return plainToInstance(ProductResponseDto, updatedProduct, { excludeExtraneousValues: true });
        } catch (error) {
            this.handleError(error);
        }
    }

    @Delete(":sku")
    async delete(@Param("sku") sku: string): Promise<{ message: string }> {
        try {
            await this.deleteProductUseCase.execute(sku);

            return { message: `Product with SKU ${sku} has been successfully deleted` };
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: Error): never {
        if (error instanceof ResourceNotFoundError) {
            throw new NotFoundException();
        } else if (error instanceof ValidationDomainError) {
            throw new BadRequestException(error.message);
        } else if (error instanceof ValidationMultipleErrors) {
            throw new BadRequestException(error.errors);
        }

        throw error;
    }
}
