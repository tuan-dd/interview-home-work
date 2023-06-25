import { ERole } from '@/models/User';
import JWT from 'jsonwebtoken';

export interface PayLoadInToken {
  email: string;
  role: ERole;
}

export interface IDataAfterEncode extends JWT.JwtPayload {
  email: string;
  role: ERole;
  name?: string;
}

const createTokenPair = (payLoadInToken: PayLoadInToken, secretKey: string) => {
  const accessToken = JWT.sign(payLoadInToken, secretKey, {
    expiresIn: '1 day',
  });
  const refreshToken = JWT.sign(payLoadInToken, secretKey, {
    expiresIn: '7 day',
  });

  return { accessToken, refreshToken };
};

const createToken = (
  payLoadInToken: PayLoadInToken,
  secretKey: string,
  expires: string | number,
) => {
  return JWT.sign(payLoadInToken, secretKey, { expiresIn: expires });
};

const verifyToken = (token: string, secretKey: string): IDataAfterEncode | false => {
  try {
    const decodedToken = JWT.verify(token, secretKey);
    return decodedToken as IDataAfterEncode;
  } catch (err) {
    return false;
  }
};

export { createTokenPair, verifyToken, createToken };
