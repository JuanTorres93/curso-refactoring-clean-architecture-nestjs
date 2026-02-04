import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ResourceNotFoundError, ValidationDomainError, ValidationMultipleErrors } from "../../common/domain/errors";
import { GetProductsUseCase } from "../domain/use-cases/get.products.usecase";
import { CreateProductDto } from "./dto/create.product.dto";
import { UpdateProductDto } from "../dto/update.product.dto";
import { ProductsError } from "../products.error";
import { ProductsService } from "../products.service";
import { ProductResponseDtoOld } from "../dto/response.product.dto";
import { ProductResponseDto } from "./dto/response.product.dto";
import { GetProductBySkuUseCase } from "../domain/use-cases/get.product.bySku.usecase";
import { DeleteProductUseCase } from "../domain/use-cases/delete.product.usecase";
import { CreateProductUseCase } from "../domain/use-cases/create.product.usecase";

@Controller("products")
export class ProductsController {
    constructor(
        private readonly getProductsUseCase: GetProductsUseCase,
        private readonly getProductBySkuUseCase: GetProductBySkuUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly createProductUseCase: CreateProductUseCase,

        /**
         * @deprecated use use cases instead of service directly
         */
        private readonly productsService: ProductsService
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
    async update(
        @Param("sku") sku: string,
        @Body() updateProductDto: UpdateProductDto
    ): Promise<ProductResponseDtoOld> {
        try {
            const product = await this.productsService.findOne(sku);

            if (!product) {
                throw new NotFoundException();
            }

            const updatedProduct = await this.productsService.update(sku, updateProductDto);

            return plainToInstance(ProductResponseDtoOld, updatedProduct, { excludeExtraneousValues: true });
        } catch (error) {
            if (error instanceof ProductsError) {
                throw new BadRequestException(error.message);
            } else if (error instanceof HttpException) {
                throw error;
            } else {
                throw new InternalServerErrorException();
            }
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
