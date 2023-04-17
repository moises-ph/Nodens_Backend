import * as jose from "jose";
import { _SECRET } from "../configuration/config";

export async function validateToken (request : any, reply : any, next : any) {
    let requestToken : string = request.headers.Authorization || null;
    if(requestToken){
        requestToken = requestToken.replace("Bearer ", "");
        const { payload }  = await jose.jwtVerify(requestToken, new TextEncoder().encode(_SECRET));
        console.log(payload);
    }
    next();
}
