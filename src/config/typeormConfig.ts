import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { BlogCategoryEntity } from "src/modules/blog/entities/blog.category.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BookmarksEntity } from "src/modules/blog/entities/bookmark.entity";
import { CommentsEntity } from "src/modules/blog/entities/comment.entity";
import { BlogLikesEntity } from "src/modules/blog/entities/like.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { OtpEntity } from "src/modules/user/entities/otp.entity";
import { ProfileEntity } from "src/modules/user/entities/profile.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

export function TypeOrmConfig(): TypeOrmModuleOptions {
    const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, } = process.env
    return {
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        autoLoadEntities: false,
        entities: [UserEntity,OtpEntity,ProfileEntity,CategoryEntity,BlogLikesEntity,BlogEntity,CommentsEntity,BookmarksEntity,BlogCategoryEntity],
        synchronize: true,
        type: 'postgres',
    }
}
   