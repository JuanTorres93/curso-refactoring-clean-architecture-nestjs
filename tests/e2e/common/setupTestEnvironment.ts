import { TypeOrmModule } from "@nestjs/typeorm";
import { createAppAndResetDatabase } from "../../common/createAppAndResetDatabase";

export const setupTestEnvironment = async () => {
    return createAppAndResetDatabase(
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "127.0.0.1",
            port: 3307,
            username: "root",
            password: "root",
            database: "staging",
            autoLoadEntities: true,
            synchronize: true,
            //logging: true,
        })
    );
};
