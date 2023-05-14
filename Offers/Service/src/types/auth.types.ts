import { FromSchema } from "json-schema-to-ts";

export interface IAuthUserSchema {
    email : string,
    userName : string,
    Rol : string,
    verified : boolean
}