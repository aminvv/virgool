import { Gender } from "@common/common/enums/gender.enum";
import { Roles } from "@common/common/enums/role.enum";
import { UserStatus } from "@common/common/enums/status.enum";
import { BlogStatus } from "@common/modules/blog/enum/status.enum";
import { EntityName } from "src/common/enums/entity.enum";
import { Generated, MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class $npmConfigName1732271479668 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {


        // create------User----------Table
        await queryRunner.createTable(
            new Table({
                name: EntityName.User,
                columns: [
                    { name: "id", isPrimary: true, type: "serial", isNullable: true },
                    { name: "username", type: "character varying(50)", isNullable: true, isUnique: true },
                    { name: "phone", type: "character varying(12)", isNullable: true, isUnique: true },
                    { name: "email", type: "character varying(100)", isNullable: true, isUnique: true },
                    { name: "new_email", type: "varchar(100)", isNullable: true },
                    { name: "status", type: "enum", enum: [UserStatus.Block, UserStatus.Report], isNullable: true },
                    { name: "balance", type: "numeric", isNullable: true, default: 0 },
                    { name: "verify_email", type: "boolean", isNullable: true, default: false },
                    { name: "verify_phone", type: "boolean", isNullable: true, default: false },
                    { name: "new_phone", type: "varchar(100)", isNullable: true },
                    { name: "password", type: "varchar(20)", isNullable: true },
                    { name: "otpId", type: "int", isNullable: false, isUnique: true },
                    { name: "role", type: "enum", enum: [Roles.Admin, Roles.User] },
                    { name: "profileId", type: "int", isNullable: false, isUnique: true },
                    { name: "created_at", type: "timestamp", default:  "CURRENT_TIMESTAMP" },
                ]
            }), true
        )
        //@ts-ignore
        // await queryRunner.addColumn(EntityName.User, { name: "balance", type: "numeric", isNullable: true, default: 0 })

        // To manually delete a database
        // const balance=await queryRunner.hasColumn(EntityName.User,"balance")
        // if(!balance) await queryRunner.addColumn(EntityName.User,{name:"balance",type:"numeric",isNullable:true ,default:0})

        // const username = await queryRunner.hasColumn(EntityName.User, "username")
        // if (username) {
        //     await queryRunner.changeColumn(EntityName.User, "username", new TableColumn({
        //         name: "username",
        //         type: "varchar(40)",
        //         isNullable: true,
        //         isUnique: true,
        //     }))
        // }
        // Editing column information using raw query
        // await queryRunner.query(`ALTER TABLE "user" RENAME "mobile"TO"phone"`)



        // create------Profile----------Table
        await queryRunner.createTable(
            new Table({
                name: EntityName.Profile,
                columns: [
                    { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "nick_name", type: "varchar", isNullable: true, },
                    { name: "bio", type: "varchar", isNullable: true, },
                    { name: "image_profile", type: "varchar", isNullable: true, },
                    { name: "bg_image", type: "varchar", isNullable: true, },
                    { name: "gender", type: "enum", enum: [Gender.men, Gender.women, Gender.other], isNullable: true, },
                    { name: "birthday", type: "date", isNullable: true, },
                    { name: "linkedin_profile", type: "varchar", isNullable: true, },
                    { name: "x_profile", type: "varchar", isNullable: true, },
                    { name: "userId", type: "int", isUnique: true }
                ]
            }), true
        )
        // create------Otp----------Table
        await queryRunner.createTable(new Table({
            name: EntityName.Otp,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "code", type: "varchar", isNullable: false },
                { name: "userId", type: "int", isNullable: false, isUnique: true },
                { name: "method", type: "varchar", isNullable: true },
                { name: "expiresIn", type: "timestamp", isNullable: true },
            ]
        }))

        // create------Image----------Table
        await queryRunner.createTable(new Table({
            name: EntityName.Image,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar" },
                { name: "alt", type: "varchar" },
                { name: "userId", type: "int", isUnique: true, isNullable: true },
                { name: "create_at", type: "timestamp", default:  "CURRENT_TIMESTAMP" },
            ]
        }), true)
        // create------Follow----------Table
        await queryRunner.createTable(new Table({
            name: EntityName.follow,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "followerId", type: "int" },
                { name: "followingId", type: "int" },
                { name: "create_at", type: "timestamp", default:  "CURRENT_TIMESTAMP" },
            ]
        }), true)

        // create------Blog----------Table
        await queryRunner.createTable(new Table({
            name: EntityName.Blog,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: "title", type: "varchar(50)", isNullable: false },
                { name: "description", type: "varchar", isNullable: false },
                { name: "content", type: "text", isNullable: true },
                { name: "image", type: "varchar", isNullable: false },
                { name: "authorId", type: "int", isNullable: false },
                { name: "status", type: "enum", isNullable: true, enum: [BlogStatus.Draft, BlogStatus.Published, BlogStatus.Reject], default: `'${BlogStatus.Draft}'` },
                { name: "slug", type: "varchar", isNullable: false, isUnique: true },
                { name: "time_for_study", type: "varchar", isNullable: false },
                { name: "create_at", type: "timestamp", default:  "CURRENT_TIMESTAMP" },
                { name: "update_at", type: "timestamp", default:  "CURRENT_TIMESTAMP" }

            ]
        }), true)

        // create------Blog_Like----------Table
        await queryRunner.createTable(new Table({
            name: EntityName.BlogLikes,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "blogId", type: "int" },
                { name: "userId", type: "int" },
            ]
        }), true)

        // create------Blog_bookmark----------Table
        await queryRunner.createTable(new Table({
            name: EntityName.BlogBookmarks,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "blogId", type: "int" },
                { name: "userId", type: "int" },
            ]
        }), true)

        // create------Blog_bookmark----------Table
        await queryRunner.createTable(new Table({
            name: EntityName.BlogComments,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "userId", type: "int", isNullable: false },
                { name: "blogId", type: "int", isNullable: false },
                { name: "text", type: "varchar", isNullable: false },
                { name: "parentId", type: "int", isNullable: true },
                { name: "accepted", type: "boolean", default: false },
                { name: "created_at", type: "timestamp", default:  "CURRENT_TIMESTAMP" }
            ]
        }), true);

        // create------Blog_category----------Table
        await queryRunner.createTable(new Table({
            name: EntityName.BlogCategory,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "blogId", type: "int", isNullable: false },
                { name: "categoryId", type: "int", isNullable: false },
            ]
        }), true)

        // create------Category----------Table
        await queryRunner.createTable(new Table({
            name: EntityName.Category,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "title", type: "varchar", isNullable: false },
                { name: "priority", type: "int", isNullable: true }
            ]
        }), true)




        // --------blog_comment ---------table connections
        await queryRunner.createForeignKey(EntityName.BlogComments, new TableForeignKey({
            columnNames: ['userId'], referencedColumnNames: ['id'],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE"
        }))
        await queryRunner.createForeignKey(EntityName.BlogComments, new TableForeignKey({
            columnNames: ['blogId'], referencedColumnNames: ['id'],
            referencedTableName: EntityName.Blog,
            onDelete: "CASCADE"
        }))
        await queryRunner.createForeignKey(EntityName.BlogComments, new TableForeignKey({
            columnNames: ['parentId'], referencedColumnNames: ['id'],
            referencedTableName: EntityName.BlogComments,
            onDelete: "CASCADE"
        }))

        // --------blog_category ---------table connections
        await queryRunner.createForeignKey(EntityName.BlogCategory, new TableForeignKey({
            columnNames: ['blogId'], referencedColumnNames: ['id'],
            referencedTableName: EntityName.Blog,
            onDelete: "CASCADE"
        }))
        await queryRunner.createForeignKey(EntityName.BlogCategory, new TableForeignKey({
            columnNames: ['categoryId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.Category,
            onDelete: "CASCADE"
        }))

        // --------blog_bookmark ---------table connections
        await queryRunner.createForeignKey(EntityName.BlogBookmarks, new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE"
        }))
        await queryRunner.createForeignKey(EntityName.BlogBookmarks, new TableForeignKey({
            columnNames: ['blogId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.Blog,
            onDelete: "CASCADE"
        }))

        // --------blog_like ---------table connections
        await queryRunner.createForeignKey(EntityName.BlogLikes, new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE"
        }))
        await queryRunner.createForeignKey(EntityName.BlogLikes, new TableForeignKey({
            columnNames: ['blogId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.Blog,
            onDelete: "CASCADE"
        }))

        // --------Follow ---------table connections
        await queryRunner.createForeignKey(EntityName.follow, new TableForeignKey({
            columnNames: ['followerId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE",
        }))

        await queryRunner.createForeignKey(EntityName.follow, new TableForeignKey({
            columnNames: ['followingId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE"
        }))

        // --------Image ---------table connections
        await queryRunner.createForeignKey(EntityName.Image, new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE"
        }))
        // --------Otp ---------table connections
        await queryRunner.createForeignKey(EntityName.Otp, new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE"
        }))

        await queryRunner.createForeignKey(EntityName.User, new TableForeignKey({
            columnNames: ['otpId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.Otp,
            onDelete: "CASCADE"
        }))
        // --------Profile ---------table connections
        await queryRunner.createForeignKey(EntityName.Profile, new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE"
        }))

        await queryRunner.createForeignKey(EntityName.User, new TableForeignKey({
            columnNames: ['profileId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.Profile,
        }))
        // --------Blog ---------table connections
        await queryRunner.createForeignKey(EntityName.Blog, new TableForeignKey({
            columnNames: ["authorId"],
            referencedColumnNames: ["id"],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE",
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // const userTable=await queryRunner.hasTable(EntityName.User)
        // if(userTable) await queryRunner.dropTable(EntityName.User)
        // or userTable ===>>> (true)
        // if not exist   .dropTable  write=  await queryRunner.dropColumn(EntityName.User,"balance")



        //Delete foreign key -------blog_category
        const blog_commentTable = await queryRunner.getTable(EntityName.BlogComments)
        if (blog_commentTable) {
            const blogFk = blog_commentTable.foreignKeys.find(fk => fk.columnNames.indexOf("blogId") !== -1)
            if (blogFk) await queryRunner.dropForeignKey(EntityName.BlogComments, blogFk)

            const userFk = blog_commentTable.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1)
            if (userFk) await queryRunner.dropForeignKey(EntityName.BlogComments, userFk)

            const parentFk = blog_commentTable.foreignKeys.find(fk => fk.columnNames.indexOf("parentId") !== -1)
            if (parentFk) await queryRunner.dropForeignKey(EntityName.BlogComments, parentFk)
        }

        //Delete foreign key -------blog_category
        const blog_categoryTable = await queryRunner.getTable(EntityName.BlogCategory)
        if (blog_categoryTable) {
            const blogFk = blog_categoryTable.foreignKeys.find(fk => fk.columnNames.indexOf("blogId") !== -1)
            if (blogFk) await queryRunner.dropForeignKey(EntityName.BlogCategory, blogFk)

            const categoryFk = blog_categoryTable.foreignKeys.find(fk => fk.columnNames.indexOf("categoryId") !== -1)
            if (categoryFk) await queryRunner.dropForeignKey(EntityName.BlogCategory, categoryFk)
        }

        //Delete foreign key -------blog_bookmark
        const blogBookmarkTable = await queryRunner.getTable(EntityName.BlogBookmarks)
        if (blogBookmarkTable) {
            const userFK = blogBookmarkTable.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1)
            if (userFK) await queryRunner.dropForeignKey(EntityName.BlogBookmarks, userFK)

            const blogFk = blogBookmarkTable.foreignKeys.find(fk => fk.columnNames.indexOf("blogId") !== -1)
            if (blogFk) await queryRunner.dropForeignKey(EntityName.BlogBookmarks, blogFk)
        }

        //Delete foreign key -------blog_like
        const blogLikeTable = await queryRunner.getTable(EntityName.BlogLikes)
        if (blogLikeTable) {
            const userFK = blogLikeTable.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1)
            if (userFK) await queryRunner.dropForeignKey(EntityName.BlogLikes, userFK)

            const blogFk = blogLikeTable.foreignKeys.find(fk => fk.columnNames.indexOf("blogId") !== -1)
            if (blogFk) await queryRunner.dropForeignKey(EntityName.BlogLikes, blogFk)
        }

        //Delete foreign key -------follow
        const followTable = await queryRunner.getTable(EntityName.follow)
        if (followTable) {
            const FollowingFK = followTable.foreignKeys.find(fk => fk.columnNames.indexOf("followingId") !== -1)
            if (FollowingFK) await queryRunner.dropForeignKey(EntityName.follow, FollowingFK)

            const followerFK = followTable.foreignKeys.find(fk => fk.columnNames.indexOf("follower") !== -1)
            if (followerFK) await queryRunner.dropForeignKey(EntityName.follow, followerFK)
        }

        //Delete foreign key -------Image
        const image = await queryRunner.getTable(EntityName.Image)
        if (image) {
            const imageFK = image.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1)
            if (imageFK) await queryRunner.dropForeignKey(EntityName.Image, imageFK)
        }

        //Delete foreign key -------Blog
        const blog = await queryRunner.getTable(EntityName.Blog)
        if (blog) {
            const userBlogFK = blog.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1)
            if (userBlogFK) await queryRunner.dropForeignKey(EntityName.Blog, userBlogFK)
        }

        //Delete foreign key -------Otp
        const otp = await queryRunner.getTable(EntityName.Otp)
        if (otp) {
            const userFK = otp.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1)
            if (userFK) await queryRunner.dropForeignKey(EntityName.Otp, userFK)
        }

        const userOtp = await queryRunner.getTable(EntityName.User)
        if (userOtp) {
            const otpFk = userOtp.foreignKeys.find(fk => fk.columnNames.indexOf("otpId") !== -1)
            if (otpFk) await queryRunner.dropForeignKey(EntityName.User, otpFk)
        }

        //Delete foreign key -------profile
        const profile = await queryRunner.getTable(EntityName.Profile,)
        if (profile) {
            const userFK = profile.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1)
            if (userFK) await queryRunner.dropForeignKey(EntityName.Profile, userFK)
        }

        const userProfile = await queryRunner.getTable(EntityName.User)
        if (userProfile) {
            const profileFK = userProfile.foreignKeys.find(fk => fk.columnNames.indexOf("profileId") !== -1)
            if (profileFK) await queryRunner.dropForeignKey(EntityName.User, profileFK)
        }



        await queryRunner.dropTable(EntityName.BlogComments, true)
        await queryRunner.dropTable(EntityName.Category, true)
        await queryRunner.dropTable(EntityName.BlogCategory, true)
        await queryRunner.dropTable(EntityName.BlogBookmarks, true)
        await queryRunner.dropTable(EntityName.BlogLikes, true)
        await queryRunner.dropTable(EntityName.follow, true)
        await queryRunner.dropTable(EntityName.Image, true)
        await queryRunner.dropTable(EntityName.Otp, true)
        await queryRunner.dropTable(EntityName.Blog, true)
        await queryRunner.dropTable(EntityName.Profile, true)
        await queryRunner.dropTable(EntityName.User, true)

    }

}
