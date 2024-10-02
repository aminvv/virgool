 export const createSlug=(str:string)=>{
     return str?.replace(/[\s]+/g,'-')?.replace(/[؟<>ءٔ‌ٰ؛:«»ةًٌٍَُِّْ!٬٫٬!٬٫ْ٫،)()]+/g,'-')
 }