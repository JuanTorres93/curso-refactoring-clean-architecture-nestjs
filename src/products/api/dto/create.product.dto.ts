import { IsNumber, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    sku: string;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    category: string;

    @IsString()
    @IsUrl()
    @IsOptional()
    image: string;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a number with a maximum of 2 decimal places" })
    @Min(0)
    @Max(9999.99)
    price: number;
}
