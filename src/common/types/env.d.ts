namespace NodeJS{
    interface ProcessEnv {
        //Application
        PORT:number

        //DataBase
        DB_PORT:number
        DB_HOST:string
        DB_USERNAME:string
        DB_PASSWORD:string
        DB_NAME:string


        //Token
        COOKIE_SECRET:string
        OTP_TOKEN_SECRET:string

    }
} 