import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { request } from "express";




@Controller('/auth/google')
@ApiTags('Google Auth')
@UseGuards(AuthGuard('google'))
export class GoogleAuthController{
    @Get()
    googleLogin(@Req() req){

    }

    @Get('/redirect')
    googleRedirect(@Req() req){
         return req.user
    }
}