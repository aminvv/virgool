import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CategoryEntity } from "src/modules/category/category/entities/category.entity";
import { OtpEntity } from "src/modules/user/user/entities/otp.entity";
import { ProfileEntity } from "src/modules/user/user/entities/profile.entity";
import { UserEntity } from "src/modules/user/user/entities/user.entity";


export function TypeOrmConfig(): TypeOrmModuleOptions {
    const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, } = process.env
    return {
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        autoLoadEntities: false,
        entities: [UserEntity,OtpEntity,ProfileEntity,CategoryEntity],
        synchronize: true,
        type: 'postgres',
    }
}
 