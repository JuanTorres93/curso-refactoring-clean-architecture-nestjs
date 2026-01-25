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
import { CreateProductDto } from "./dto/create.product.dto";
import { ProductsService } from "./products.service";
import { plainToInstance } from "class-transformer";
import { ProductResponseDto } from "./dto/response.product.dto";
import { UpdateProductDto } from "./dto/update.product.dto";
import { ProductsError } from "./products.error";

@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async findAll(): Promise<ProductResponseDto[]> {
        const products = await this.productsService.findAll();

        return plainToInstance(ProductResponseDto, products, { excludeExtraneousValues: true });
    }

    @Get(":sku")
    async findOne(@Param("sku") sku: string): Promise<ProductResponseDto> {
        const product = await this.productsService.findOne(sku);

        if (!product) {
            throw new NotFoundException();
        }

        return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
    }

    @Post()
    async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        try {
            const product = await this.productsService.create(createProductDto);

            return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
        } catch (error) {
            if (error instanceof ProductsError) {
                throw new BadRequestException(error.message);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    @Put(":sku")
    async update(@Param("sku") sku: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        try {
            const product = await this.productsService.findOne(sku);

            if (!product) {
                throw new NotFoundException();
            }

            const updatedProduct = await this.productsService.update(sku, updateProductDto);

            return plainToInstance(ProductResponseDto, updatedProduct, { excludeExtraneousValues: true });
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
