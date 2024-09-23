import { Request } from "express";
import { mkdir, mkdirSync } from "fs";
import multer from "multer";
import { extname, join } from "path";




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
const fileName= `${Date .now()}${ext}`
Callback(null,fileName)
}

