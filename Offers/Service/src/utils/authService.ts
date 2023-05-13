import { _URL_AUTH } from "../configuration/config";
import { IAuthUserSchema } from "../types/auth.types";
import fetch from "node-fetch";

export const fetchOrganizer = async (id : string) : Promise<IAuthUserSchema | any> => {
    return new Promise((resolve, reject) => {
        fetch(`${_URL_AUTH}/api/user/${id}`)
        .then((res: { json: () => any; }) => res.json())
        .then((data: unknown) => resolve(data))
        .catch((err: any) => reject(err))
    });
}
