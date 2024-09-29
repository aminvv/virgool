


export enum BadRequestMessage{
 InValidLoginData="اطلاعات ارسال شده برای ورود صحیح نمیشباشد",
 InValidRegisterData="اطلاعات ارسال شده برای ثبت نام صحیح نمیشباشد",
 SomeThingWrong="خطایی پیش امده",
}

export enum AuthMessage{
NotFoundAccount="حساب کاربری یافت نشد",
AlreadyExistAccount="حساب کاربری با این مشخصات وجود دارد",
ExpiredCode="کد تایید منقضی شده مجددا تلاش کنید",
TryAgain="دوباره تلاش کنید",
loginAgain="مجددا وارد حساب کاربری خود شوید",
loginRequired="وارد حساب کاربری خود شوید"
}

export enum NotFoundMessage{
    NotFound="موردی یافت نشد",
    NotFoundCategory=" دسته بندی یافت تشد",
    NotFoundPost="مقاله ای یافت نشد",
    NotFoundUser=" کاریری یافت نشد",

}

export enum ValidationMessage{
InvalidImageFormat="قرمت تصویر انتخاب شده باید از نوع  jpg ,png ,jpeg باشد",
InvalidEmailFormat="ایمیل وارد شده صحیح نمیاشد",
InvalidPhoneFormat="شماره موبایل وارد شده صحیح نمیاشد",
}

export enum publicMessage{
    SendOtp="کد یکبار مصرف با موفقیت ارسال شد",
    loggedIn="با موفقیت وارد حساب خود شدید",
    created="با موفقیت ایجاد شد",
    Delete="با موفقیت حدف شد",
    Update=" با موفقیت به روز رسانی شد",
    Inserted=" با موفقیت درج شد ",
}

export enum ConflictMessage{
    categoryTitle="عنوان دشته بندی قبلا ثبت شده",
    email="ابمبل توسط شخص دیگری استفاده شده",
    phone="شماره توسط شخص دیگری استفاده شده",
}