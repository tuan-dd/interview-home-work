import {
  BadRequestError,
  CreatedResponse,
  DuplicateError,
  NotFoundError,
  SuccessResponse,
} from '@/helpers/utils';
import { EKeyHeader } from '@/middleware/validate';
import { UserDocument } from '@/models/User';
import { SignInSchema, SignUpSchema } from '@/schema/auth.schema';
import userService from '@/services/user.service';
import { Pros, convertStringToObjectId, getFilterData } from '@/utils/otherUtil';
import { set } from '@/utils/redisUtil';

import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

/**
 * @notify update or create user the password will auto hash
 */

class AuthController {
  signUp = async (req: Request<any, any, SignUpSchema>, res: Response) => {
    const { email } = req.body;
    const userDb = await userService.findOne({ email });

    if (userDb) throw new DuplicateError('Duplicate user');

    const newUser = await userService.createOne(req.body);

    new CreatedResponse({
      message: 'Create user successfully',
      data: getFilterData(
        [
          'name',
          'email',
          'isVerify',
          'avatar',
          '_id',
          'isHaveOtp',
          'createdAt',
          'updatedAt',
          'role',
        ],
        newUser,
      ),
    }).send(res);
  };

  signIn = async (req: Request<any, any, SignInSchema>, res: Response) => {
    const { password, email } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const convertIp = (ip as string).split(', ');

    const userDb: Pros<UserDocument> = await userService.findUserAndCheckPass({
      email,
      password,
    });

    if (userDb.isHaveOtp) {
      await set(`login:${email}`, userDb._id.toString(), {
        EX: 60 * 10,
      });

      return new SuccessResponse({ message: 'Login success, next to input OTP' }).send(
        res,
      );
    }

    const { accessToken, refreshToken } = await userService.createTokens({
      email,
      role: userDb.role,
      userId: userDb._id,
      ip: convertIp[0],
    });

    return new SuccessResponse({
      message: 'Login success',
      data: { user: userDb, accessToken, refreshToken },
    }).send(res);
  };

  getNewAccessToken = async (req: Request, res: Response) => {
    const userId = req.headers[EKeyHeader.USER_ID] as string;
    const refreshToken = req.headers[EKeyHeader.REFRESH_TOKEN] as string;
    const accessToken = req.headers[EKeyHeader.ACCESS_TOKEN] as string;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const convertIp = (ip as string).split(', ');

    if (!userId) throw new BadRequestError('Header must have userId');

    if (!refreshToken) throw new BadRequestError('Header must have refresh token');
    if (!accessToken) throw new BadRequestError('Header must have access token');

    if (!isValidObjectId(userId as string)) {
      throw new NotFoundError('UserId wrong');
    }

    const newAccessToken = await userService.createNewAccessToken(
      convertStringToObjectId(userId),
      convertIp[0],
      refreshToken,
    );

    new SuccessResponse({
      message: 'Send new access token',
      data: newAccessToken,
    }).send(res);
  };

  signOut = async (req: Request, res: Response) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipSave = (ip as string).split(', ');
    const userId = req.userId;

    const result = await userService.deleteToken({ userId, ip: ipSave[0] });

    if (!result) throw new BadRequestError('Can not sign out');

    new SuccessResponse({
      message: 'Sign out successfully',
    }).send(res);
  };

  // validateOTP = async (req: Request, res: Response) => {};

  // generateOTP = async (req: Request, res: Response) => {};

  // verifyOTP = async (req: Request, res: Response) => {};

  // disableOTP = async (req: Request, res: Response) => {};

  // forgetPwd = async (req: Request<any, any, ForgetPwdSchema>, res: Response) => {};
}

const authController = new AuthController();
export default authController;
