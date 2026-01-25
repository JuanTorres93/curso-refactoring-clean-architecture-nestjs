import { Expose } from "class-transformer";

export class UserResponseDto {
    @Expose()
    username: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    isActive: boolean;
}
