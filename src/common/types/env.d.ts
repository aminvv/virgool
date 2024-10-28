namespace NodeJS{
    interface ProcessEnv {
        //Application
        PORT:number

        //DataBase
        DB_PORT:number
        DB_HO5ST:string
        DB_USERNAME:string
        DB_PASSWORD:string
        DB_NAME:string


        //Token
        COOKIE_SECRET:string
        OTP_TOKEN_SECRET:string
        ACCESS_TOKEN_SECRET:string
        EMAIL_TOKEN_SECRET:string
        PHONE_TOKEN_SECRET:string

        SEND_SMS_URL:string

        GOOGLE_CLIENT_ID:string
        GOOGLE_CLIENT_SECRET:string
    }
} 