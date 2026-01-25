import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Category } from "../categories/categories.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([Category])],
    providers: [ProductsService],
    controllers: [ProductsController],
})
export class ProductsModule {}
