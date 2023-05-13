import { FromSchema } from "json-schema-to-ts";

export interface IAuthUserSchema {
    Email : string,
    userName : string,
    Rol : string,
    verified : boolean
}