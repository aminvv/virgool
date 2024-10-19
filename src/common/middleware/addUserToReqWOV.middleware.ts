import { Injectable, NestMiddleware} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/modules/auth/auth.service";
import { isJWT } from "class-validator";
@Injectable()
export class AddUserToReqWOV implements NestMiddleware {
    constructor(private authService: AuthService) { }
    async use(request: Request, res: Response, next: NextFunction) {
        const token = this.ExtractToken(request)
        if(!token)return next()
            try {
               let user = await this.authService.validationAccessToken(token)
                if(user)request.user=user

            } catch (error) {
                console.error('Token validation error:', error)
            }
            next()
    }



    protected ExtractToken(request: Request) {
        const { authorization } = request.headers
        if (!authorization || authorization.trim() == "") {
            return null
        }
        const [bearer, token] = authorization.split(" ")
        if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
            return null
        }
        return token

    }

}