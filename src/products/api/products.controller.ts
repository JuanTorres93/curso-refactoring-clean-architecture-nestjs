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
import { ResourceNotFoundError } from "../../common/domain/errors";
import { GetProductsUseCase } from "../domain/get.products.usecase";
import { CreateProductDto } from "../dto/create.product.dto";
import { UpdateProductDto } from "../dto/update.product.dto";
import { ProductsError } from "../products.error";
import { ProductsService } from "../products.service";
import { ProductResponseDtoOld } from "../dto/response.product.dto";
import { ProductResponseDto } from "./dto/response.product.dto";
import { GetProductBySkuUseCase } from "../domain/get.product.bySku.usecase";

@Controller("products")
export class ProductsController {
    constructor(
        private readonly getProductsUseCase: GetProductsUseCase,
        private readonly getProductBySkuUseCase: GetProductBySkuUseCase,

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
            if (error instanceof ResourceNotFoundError) {
                throw new NotFoundException(error.message);
            }

            throw error;
        }
    }

    @Post()
    async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDtoOld> {
        try {
            const product = await this.productsService.create(createProductDto);

            return plainToInstance(ProductResponseDtoOld, product, { excludeExtraneousValues: true });
        } catch (error) {
            if (error instanceof ProductsError) {
                throw new BadRequestException(error.message);
            } else {
                throw new InternalServerErrorException();
            }
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
    async remove(@Param("sku") sku: string): Promise<{ message: string }> {
        const product = await this.productsService.findOne(sku);

        if (!product) {
            throw new NotFoundException();
        }

        await this.productsService.remove(sku);

        return { message: `Product with SKU ${sku} has been successfully deleted` };
    }
}
