import * as Yup from 'yup';

export const createPostSchema = Yup.object().shape({
  body: Yup.object().shape({
    title: Yup.string().min(1).max(40).required(),
    content: Yup.string().min(1).max(700).required(),
    background: Yup.string().notRequired(),
    tags: Yup.array(Yup.string().required()).notRequired(),
  }),
});

export const updatePostSchema = Yup.object().shape({
  body: Yup.object().shape({
    title: Yup.string().min(1).max(40).notRequired(),
    content: Yup.string().min(1).max(700).notRequired(),
    background: Yup.string().notRequired(),
    tags: Yup.array(Yup.string().required()).notRequired(),
    isDelete: Yup.boolean().required(),
  }),
});

export const getPostSchema = Yup.object().shape({
  query: Yup.object().shape({
    author: Yup.string().notRequired(),
    search: Yup.string().notRequired(),
    title: Yup.string().max(40).notRequired(),
    content: Yup.string().max(700).notRequired(),
    tags: Yup.array(Yup.string()).notRequired(),
    page: Yup.number().integer().min(1).notRequired(),
    limit: Yup.number().integer().min(3).max(45).notRequired(),
    createdAt_gte: Yup.date().notRequired(),
    createdAt_lte: Yup.date().notRequired(),
  }),
});

export type CreatePostSchema = Yup.InferType<typeof createPostSchema>['body'];
export type UpdatePostSchema = Yup.InferType<typeof updatePostSchema>['body'];
export type GetPostSchema = Yup.InferType<typeof getPostSchema>['query'];
