import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./common/public.decorator";
import { UsersService } from "../users/users.service";
import { UserResponseDto } from "./dto/response.user.dto";
import { plainToInstance } from "class-transformer";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("login")
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Get("profile")
    getProfile(@Request() req) {
        const user = this.usersService.findOne(req.user.username);

        return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
    }
}
