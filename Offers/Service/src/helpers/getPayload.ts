import * as jose from 'jose';
import { _SECRET } from '../configuration/config';

export const getJWTPayload = async (jwt : string) => {
    const { payload } = await jose.jwtVerify(jwt, new TextEncoder().encode(_SECRET));
    return payload;
}