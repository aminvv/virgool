import { error } from "console";
import { Request } from "express";
import { mkdir, mkdirSync } from "fs";
import multer from "multer";
import { extname, join } from "path";
import { ValidationMessage } from "../enums/message.enum";
import { BadRequestException } from "@nestjs/common";




export type CallbackDestination= (error:Error,destination:string)=>void
export type CallbackFileName= (error:Error,destination:string)=>void
export type MulterFile=Express.Multer.File

export function multerDestination(fieldName:string){
return function (req:Request,file:MulterFile,Callback:CallbackDestination):void{
    let path=join("public","uploads",fieldName)
    mkdirSync(path,{recursive:true})
    Callback(null,path)

}
}


export function multerFileName(req:Request,file:MulterFile,Callback:CallbackFileName):void{
const ext=extname(file.originalname).toLowerCase()
if(!isValidFormat(ext)){
    Callback( new BadRequestException(ValidationMessage.InvalidImageFormat),null)
}else{
    const fileName= `${Date.now()}${ext}`
Callback(null,fileName)
}
}


function isValidFormat (ext:string){
    return [".png",".jpg",".jpeg"].includes(ext)
}

