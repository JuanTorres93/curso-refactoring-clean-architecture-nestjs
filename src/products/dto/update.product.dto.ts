import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length, Matches, Max, Min } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @Matches(/^[a-zA-Z0-9]{3}_[a-zA-Z0-9]{3}_[a-zA-Z0-9]{2}$/, { message: "Invalid SKU format (must be ###_###_##)" })
    @IsNotEmpty()
    sku: string;

    @IsString()
    @IsNotEmpty()
    @Length(0, 255)
    title: string;

    @IsString()
    @IsOptional()
    @Length(0, 10000)
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
