import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/common/public.decorator";

@Controller()
export class AppController {
    @Public()
    @Get()
    getHello(): string {
        return `Refactoring Clean Architecture NestJS Server!`;
    }
}
