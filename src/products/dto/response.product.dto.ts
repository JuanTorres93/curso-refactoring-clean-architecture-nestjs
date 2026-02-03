import { Expose, Transform } from "class-transformer";

/**
 * @deprecated use ProductResponseDto instead
 */
export class ProductResponseDtoOld {
    @Expose()
    sku: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    @Transform(({ obj }) => obj.category?.categoryUid)
    category: string;

    @Expose()
    image: string;

    @Expose()
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @Expose()
    createdDate: Date;

    @Expose()
    lastUpdated: Date;
}
