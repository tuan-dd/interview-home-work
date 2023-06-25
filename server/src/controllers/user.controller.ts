import { SuccessResponse } from '@/helpers/utils';
import { UpdateUserSchema } from '@/schema/user.schema';
import userService from '@/services/user.service';
import { deleteKeyUndefined, getDeleteFilter } from '@/utils/otherUtil';
import { Request, Response } from 'express';

class UserController {
  updateMe = async (req: Request<any, any, UpdateUserSchema>, res: Response) => {
    const newUpdate = deleteKeyUndefined(req.body);
    const userId = req.userId;

    if (req.body.password) {
      await userService.updateUserAndCheckPass(userId, newUpdate);

      return new SuccessResponse({
        message: 'Update user successfully',
      }).send(res);
    }

    await userService.findByIdUpdate(userId, { $set: { ...newUpdate } });

    new SuccessResponse({
      message: 'Update user successfully',
    }).send(res);
  };

  getMe = async (req: Request, res: Response) => {
    const userId = req.userId;
    const userDb = await userService.findById(userId);

    new SuccessResponse({
      message: 'Create user successfully',
      data: getDeleteFilter(['isActive'], userDb),
    }).send(res);
  };
}

const userController = new UserController();
export default userController;
