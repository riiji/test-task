import * as jwt from 'jsonwebtoken';

export const sign = (payload: any) => jwt.sign(payload, String(process.env.ACCESS_SECRET_TOKEN));
export const verify = (token: string) => jwt.verify(token, String(process.env.ACCESS_SECRET_TOKEN));
