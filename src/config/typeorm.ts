import { config } from 'dotenv';
import { join } from 'path';
import { BlogCategoryEntity } from "src/modules/blog/entities/blog.category.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BookmarksEntity } from "src/modules/blog/entities/bookmark.entity";
import { CommentsEntity } from "src/modules/blog/entities/comment.entity";
import { BlogLikesEntity } from "src/modules/blog/entities/like.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { ImageEntity } from "src/modules/image/entities/image.entity";
import { followEntity } from "src/modules/user/entities/follow.entity";
import { OtpEntity } from "src/modules/user/entities/otp.entity";
import { ProfileEntity } from "src/modules/user/entities/profile.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { DataSource } from "typeorm";

config({ path: join(process.cwd(), ".env") });
const {DB_HO5ST,DB_PASSWORD,DB_PORT,DB_USERNAME,DB_NAME}=process.env
let dataSource= new DataSource({
    type:"postgres",
    host:DB_HO5ST,
    port:DB_PORT,
    username:DB_USERNAME,
    password:DB_PASSWORD,
    database:DB_NAME,
    synchronize:false,
    entities :[UserEntity,OtpEntity,ProfileEntity,CategoryEntity,BlogLikesEntity,BlogEntity,CommentsEntity,BookmarksEntity,BlogCategoryEntity,ImageEntity,followEntity],
    migrations:['dist/migrations/*{.ts,.js}'],
    migrationsTableName:"virgool_migration_db"
})
export default dataSource