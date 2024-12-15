import { Gender } from "@common/common/enums/gender.enum";
import { Roles } from "@common/common/enums/role.enum";
import { UserStatus } from "@common/common/enums/status.enum";
import { EntityName } from "src/common/enums/entity.enum";
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class $npmConfigName1732271479668 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
                    { name: "created_at", type: "timestamp", default: "now()" },
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

        await queryRunner.createTable(new Table({
            name: EntityName.Otp,
            columns: [
                { name: "id", type: "int",isPrimary:true, isGenerated: true, generationStrategy: "increment" },
                { name: "code", type: "varchar", isNullable: false },
                { name: "userId", type: "int", isNullable: false, isUnique: true },
                { name: "method", type: "varchar", isNullable: true },
                { name: "expiresIn", type: "timestamp", isNullable: true },
            ]
        }))

        await queryRunner.createTable(new Table({
            name: EntityName.Blog,
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: "title", type: "varchar(50)", isNullable: false },
                { name: "content", type: "text", isNullable: false },
                { name: "userId", type: "int", isNullable: false },
            ]
        }), true)

        await queryRunner.createForeignKey(EntityName.Otp, new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: EntityName.User,
            onDelete: "CASCADE"
        }))

        await queryRunner.createForeignKey(EntityName.User,new TableForeignKey({
            columnNames:['otpId'],
            referencedColumnNames:['id'],
            referencedTableName:EntityName.Otp,
            onDelete:"CASCADE"
        }))

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

        await queryRunner.createForeignKey(EntityName.Blog, new TableForeignKey({
            columnNames: ["userId"],
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
        const blog = await queryRunner.getTable(EntityName.Blog)
        if (blog) {
            const userBlogFK = blog.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1)
            if (userBlogFK) await queryRunner.dropForeignKey(EntityName.Blog, userBlogFK)
        }
        
        const otp = await queryRunner.getTable(EntityName.Otp)
        if (otp) {
            const userFK = otp.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1)
            if (userFK) await queryRunner.dropForeignKey(EntityName.Otp, userFK)
        }

        const userOtp=await queryRunner.getTable(EntityName.User)
        if(userOtp){
            const otpFk=userOtp.foreignKeys.find(fk=>fk.columnNames.indexOf("otpId") !== -1)
            if(otpFk) await queryRunner.dropForeignKey(EntityName.User,otpFk)
            }

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

        await queryRunner.dropTable(EntityName.Otp, true)
        await queryRunner.dropTable(EntityName.Blog, true)
        await queryRunner.dropTable(EntityName.Profile, true)
        await queryRunner.dropTable(EntityName.User, true)

    }

}
