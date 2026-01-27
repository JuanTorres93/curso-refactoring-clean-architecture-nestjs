import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { CategoryDB } from "../categories/data/categories.db";

@Module({
    imports: [TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([CategoryDB])],
    providers: [ProductsService],
    controllers: [ProductsController],
})
export class ProductsModule {}
