
import { config } from "dotenv";
import  { join } from "path";
import { DataSource } from "typeorm";

config()
config({ path: join(process.cwd(), ".env") })
const { DB_HOST, DB_NAME, DB_PORT, DB_PASSWORD, DB_USERNAME, } = process.env


console.log(
    {
        type: "postgres",
        host: DB_HOST,
        password: DB_PASSWORD, 
        username: DB_USERNAME,
        database:DB_NAME,
        port:DB_PORT,  
    }
);


let dataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    password: DB_PASSWORD,
    username: DB_USERNAME,
    database:DB_NAME,
    port:+DB_PORT,
    synchronize:false,
    entities: [join(__dirname, "../modules/**/entities/*.entity{.ts,js}"),],
    migrations:["dist/migration/*{.ts,.js}"],
    migrationsTableName:"virgool_migration_db"




})
export default dataSource