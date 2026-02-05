import { IsNumber, IsString } from "class-validator";

export class UpdateProductDto {
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
