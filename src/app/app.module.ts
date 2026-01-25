import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "../products/products.module";
import { CategoriesModule } from "../categories/categories.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            username: "root",
            password: "root",
            database: "production",
            autoLoadEntities: true,
            synchronize: true,
        }),
        AuthModule,
        UsersModule,
        ProductsModule,
        CategoriesModule,
    ],
    providers: [],
    controllers: [AppController],
})
export class AppModule {}
