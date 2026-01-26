import { TypeOrmModule } from "@nestjs/typeorm";
import { createAppAndResetDatabase } from "../../common/createAppAndResetDatabase";

export const setupTestEnvironment = async () => {
    return createAppAndResetDatabase(
        TypeOrmModule.forRoot({
            type: "better-sqlite3",
            database: ":memory:",
            dropSchema: true,
            autoLoadEntities: true,
            synchronize: true,
            //logging: true,
        })
    );
};
