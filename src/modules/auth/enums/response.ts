export type AuthResponse={
    code:string,
    token:string
}
export type googleUser={
    firstName?:string
    lastName?:string
    email:string
    accessToken?:string
    profile_image?:string
}