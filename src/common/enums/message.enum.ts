


export enum BadRequestMessage{
 InValidLoginData="اطلاعات ارسال شده برای ورود صحیح نمیشباشد",
 InValidRegisterData="اطلاعات ارسال شده برای ثبت نام صحیح نمیشباشد"
}

export enum AuthMessage{
NotFoundAccount="حساب کاربری یافت نشد",
AlreadyExistAccount="حساب کاربری با این مشخصات وجود دارد",
ExpiredCode="کد تایید منقضی شده مجددا تلاش کنید",
TryAgain="دوباره تلاش کنید",
loginAgain="مجددا وارد حساب کاربری خود شوید"
}

export enum NotFoundMessage{

}

export enum ValidationMessage{

}

export enum publicMessage{
    SendOtp="کد یکبار مصرف با موفقیت ارسال شد",
    loggedIn="با موفقیت وارد حساب خود شدید"
}