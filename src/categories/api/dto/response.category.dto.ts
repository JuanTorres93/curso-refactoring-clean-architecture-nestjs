import { Expose } from "class-transformer";

export class CategoryResponseDto {
    @Expose()
    categoryUid: string;

    @Expose()
    name: string;
}
