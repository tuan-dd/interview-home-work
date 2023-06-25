import crypto from 'crypto';
import * as OTPAuth from 'otpauth';
import { encode } from 'hi-base32';

const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, '').substring(0, 24);
  return base32;
};

const getOTP = (secretKey: string, email: string) =>
  new OTPAuth.TOTP({
    issuer: email,
    label: 'interview.com',
    algorithm: 'SHA1',
    digits: 6,
    period: 60,
    secret: secretKey,
  }).toString();

const isOTPValid = ({
  secretKey,
  email,
  token,
  window = undefined,
}: {
  secretKey: string;
  email: string;
  token: string;
  window?: number | undefined;
}) => {
  const otp = new OTPAuth.TOTP({
    issuer: email,
    label: 'interview.com',
    algorithm: 'SHA1',
    digits: 6,
    period: 60,
    secret: secretKey,
  });
  return otp.validate({ token, window });
};

export { getOTP, generateRandomBase32, isOTPValid };
