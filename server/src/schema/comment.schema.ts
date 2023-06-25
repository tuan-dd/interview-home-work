import { isValidObjectIdMongo } from '@/utils/otherUtil';
import * as Yup from 'yup';

Yup.addMethod<Yup.StringSchema>(Yup.string, 'objectIdValid', function (message?: string) {
  return this.test('objectIdValid', message || 'Wrong Id', (value) => {
    if (!value) return true;
    return isValidObjectIdMongo(value);
  });
});

declare module 'yup' {
  interface Schema<
    TType = any,
    TContext = any,
    TDefault = any,
    TFlags extends Yup.Flags = '',
  > {
    objectIdValid(message?: string): this;
  }
}

export const createCommentSchema = Yup.object().shape({
  body: Yup.object().shape({
    content: Yup.string().min(1).max(500).required(),
    parentSlug: Yup.string().notRequired(),
    postId: Yup.string().objectIdValid('Wrong postId').required(),
  }),
});

export const updateCommentSchema = Yup.object().shape({
  body: Yup.object().shape({
    isDelete: Yup.boolean().required(),
    content: Yup.string().when('isDelete', (isDelete, field) =>
      isDelete[0] ? field.notRequired() : field.required(),
    ),
  }),
});

export const getCommentByUserSchema = Yup.object().shape({
  query: Yup.object().shape({
    isReply: Yup.boolean().notRequired(),
    page: Yup.number().integer().min(1).notRequired(),
    limit: Yup.number().integer().min(5).max(20).notRequired(),
  }),
});

export const getCommentSchema = Yup.object().shape({
  query: Yup.object().shape({
    postId: Yup.string().objectIdValid('Wrong postId').required(),
    parentSlug: Yup.string().notRequired(),
    page: Yup.number().integer().min(1).notRequired(),
    limit: Yup.number().integer().min(3).max(45).notRequired(),
  }),
});

export type CreateCommentSchema = Yup.InferType<typeof createCommentSchema>['body'];
export type UpdateCommentSchema = Yup.InferType<typeof updateCommentSchema>['body'];
export type GetCommentByUserSchema = Yup.InferType<
  typeof getCommentByUserSchema
>['query'];
export type GetCommentSchema = Yup.InferType<typeof getCommentSchema>['query'];
