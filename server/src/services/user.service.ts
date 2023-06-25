import { BadRequestError, ForbiddenError } from '@/helpers/utils';
import BaseService from './base.service';
import User, { ERole, IUser, UserDocument } from '@/models/User';
import { Types } from 'mongoose';
import crypto from 'crypto';
import { createToken, createTokenPair, verifyToken } from '@/utils/tokenUtil';
import { deleteKey, expire, hGetAll, hSet } from '@/utils/redisUtil';
import { IRedisToken } from '@/middleware/validate';
import { getDeleteFilter } from '@/utils/otherUtil';
import { UpdateUserSchema } from '@/schema/user.schema';
class UserService extends BaseService<IUser, UserDocument> {
  constructor() {
    super(User);
  }

  findUserAndCheckPass = async ({
    email,
    password,
    _id,
  }: {
    email?: string;
    password: string;
    _id?: Types.ObjectId;
  }) => {
    let user: UserDocument;
    if (email)
      user = await this.findOne({ email, isActive: true }, '+password', {
        lean: false,
      });
    if (_id)
      user = await this.findOne({ _id, isActive: true }, '+password', {
        lean: false,
      });

    if (!user) throw new BadRequestError('Not found user');

    const isValid = await user.isPasswordValid(password);

    if (!isValid) throw new BadRequestError('Wrong password');

    return getDeleteFilter(['password', 'isActive'], user.toJSON());
  };

  updateUserAndCheckPass = async (_id: Types.ObjectId, newUpdate: UpdateUserSchema) => {
    const user = await this.findOne({ _id, isActive: true }, '+password', {
      lean: false,
    });

    const isValid = await user.isPasswordValid(newUpdate.password);

    if (!isValid) throw new BadRequestError('Wrong password');

    newUpdate.password = newUpdate.newPassword;

    Object.keys(newUpdate).forEach((key) => {
      user[key] = newUpdate[key];
    });

    await user.save();
  };

  createTokens = async ({
    email,
    role,
    userId,
    ip,
  }: {
    email: string;
    role: ERole;
    userId: Types.ObjectId;
    ip: string;
  }) => {
    const secretKey = crypto.randomBytes(32).toString('hex');

    const { accessToken, refreshToken } = createTokenPair({ email, role }, secretKey);

    await hSet(`token:${userId.toString()}:${ip}`, [
      'refreshToken',
      refreshToken,
      'secretKey',
      secretKey,
    ]);

    await expire(`token:${userId.toString()}:${ip}`, 60 * 60 * 24 * 7);

    return { accessToken, refreshToken };
  };

  createNewAccessToken = async (
    userId: Types.ObjectId,
    ip: string,
    refreshToken: string,
  ) => {
    const tokenStore: IRedisToken = await hGetAll(`token:${userId.toString()}:${ip}`);

    if (!Object.keys(tokenStore).length)
      throw new BadRequestError('You must login again');

    if (refreshToken !== tokenStore.refreshToken) {
      throw new ForbiddenError('Wrong refresh Token');
    }
    const payLoad = verifyToken(refreshToken, tokenStore.secretKey);

    if (typeof payLoad === 'boolean') throw new ForbiddenError('Wrong refresh Token');

    const newAccessToken = createToken(
      {
        email: payLoad.email,
        role: payLoad.role,
      },
      tokenStore.secretKey,
      '1day',
    );
    return newAccessToken;
  };

  deleteToken = async ({ userId, ip }: { userId: Types.ObjectId; ip: string }) => {
    const deleteToken = await deleteKey(`token:${userId.toString()}:${ip}`);
    console.log(deleteToken);
    if (deleteToken === 1) return true;

    return false;
  };
}

export default new UserService();
