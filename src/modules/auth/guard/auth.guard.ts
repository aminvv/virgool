import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT, IsJWT } from "class-validator";
import { Request } from "express";
import { AuthMessage } from "src/common/enums/message.enum";
import { AuthService } from "../auth.service";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorators";
import { get } from "http";
import { UserStatus } from "src/common/enums/status.enum";


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private authService:AuthService,private reflector:Reflector){}
    async canActivate(context: ExecutionContext) {
        const isSkippedAuthorization=this.reflector.get<boolean>(SKIP_AUTH,context.getHandler())
        if(isSkippedAuthorization)return true
        const request=context.switchToHttp().getRequest<Request>()
        const token =this.ExtractToken(request)
        request.user=await this.authService.validationAccessToken(token)
        if(request.user.status ===UserStatus.Block){
            throw new ForbiddenException(AuthMessage.Blocked)
        }
        return true
    }

    protected ExtractToken(request:Request){
        const {authorization}=request.headers
        if(!authorization || authorization.trim()==""){
            throw new UnauthorizedException(AuthMessage.loginAgain)
        }
        const[bearer,token]=authorization.split(" ")
        if(bearer?.toLowerCase()!=="bearer" || !token || !isJWT(token)){
            throw new UnauthorizedException(AuthMessage.loginRequired)
        }
        return token

    }
}