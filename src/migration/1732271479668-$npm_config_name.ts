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
                    { name: "role", type: "enum", enum: [Roles.Admin, Roles.User] },
                    { name: "status", type: "enum", enum: [UserStatus.Block, UserStatus.Report], isNullable: true },
                    { name: "new_email", type: "varchar(100)", isNullable: true },
                    { name: "profileId", type: "int", isNullable: false, isUnique: true },
                    { name: "new_phone", type: "varchar(100)", isNullable: true },
                    { name: "verify_phone", type: "boolean", isNullable: true, default: false },
                    { name: "verify_email", type: "boolean", isNullable: true, default: false },
                    { name: "password", type: "varchar(20)", isNullable: true },
                    { name: "created_at", type: "timestamp", default: "now()" },
                ]
            })
            // ,true  //not user folder write true if notExist
        )
        //@ts-ignore
        await queryRunner.addColumn(EntityName.User, { name: "balance", type: "numeric", isNullable: true, default: 0 })

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
                    { name: "id", type: "int", isPrimary: true, isNullable: true, isGenerated: true, generationStrategy: "increment" },
                    { name: "nick_name", type: "varchar", isNullable: true, },
                    { name: "bio", type: "varchar", isNullable: true, },
                    { name: "image_profile", type: "varchar", isNullable: true, },
                    { name: "userId", type: "int", isNullable: true, isUnique: true }
                ]
            }), true
        )

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
    }

    public async down(queryRunner: QueryRunner): Promise<void>{
        // const userTable=await queryRunner.hasTable(EntityName.User)
        // if(userTable) await queryRunner.dropTable(EntityName.User)
        // or userTable ===>>> (true)
        // if not exist   .dropTable  write=  await queryRunner.dropColumn(EntityName.User,"balance")
        const profile=await queryRunner.getTable(EntityName.Profile,)
        const userFK=profile.foreignKeys.find(fk=>fk.columnNames.indexOf("userId") !== -1)
        if(userFK) await queryRunner.dropForeignKey(EntityName.Profile,userFK)

        const user=await queryRunner.getTable(EntityName.User)
        const profileFK=user.foreignKeys.find(fk=>fk.columnNames.indexOf("profileId") !== -1)
        if(profileFK) await queryRunner.dropForeignKey(EntityName.User,profileFK)

            await queryRunner.dropTable(EntityName.Profile,true)
        await queryRunner.dropTable(EntityName.User, true)

    }

}
