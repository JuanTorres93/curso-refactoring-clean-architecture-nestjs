import { IsNumber, IsString, Max, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    sku: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    category: string;

    @IsString()
    image: string;

    @IsNumber()
    price: number;
}
