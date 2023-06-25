import apiService from '@app/server';
import { IAuthor, IComment, IPost, IResponse } from '@/utils/interface';

const fetchCreateComment = async ({
  content,
  parentSlug,
  postId,
}: {
  content: string;
  parentSlug?: string;
  postId: string;
}) => {
  const response = await apiService.post<IResponse<IComment>>('/comment/create', {
    content,
    parentSlug,
    postId,
  });

  return response.data.data;
};

const fetchUpdateComment = async ({
  commentId,
  content,
  isDelete = false,
}: {
  content: string;
  isDelete?: boolean;
  commentId: string;
}) => {
  const response = await apiService.put(`/comment/update/${commentId}`, {
    content,
    isDelete,
  });

  return response.data;
};

const fetchDeleteComment = async (commentId: string) => {
  const response = await apiService.put(`/comment/update/${commentId}`, {
    commentId,
    isDelete: true,
  });

  return response.data;
};

const fetchGetComments = async ({
  parentSlug,
  postId,
  page,
  limit,
}: {
  parentSlug?: string;
  postId: string;
  page: number;
  limit: number;
}) => {
  const response = await apiService.get<IResponse<IComment<string, IAuthor>[]>>(
    '/comment',
    {
      params: { postId, parentSlug, page, limit },
    },
  );

  return response.data.data;
};

const fetchGetCommentsByUser = async ({
  isReply,
  page,
  limit,
}: {
  isReply?: boolean;
  page: number;
  limit: number;
}) => {
  const response = await apiService.get<IResponse<IComment<IPost, string>[]>>(
    '/comment/user',
    {
      params: { isReply, page, limit },
    },
  );

  return response.data.data;
};

export {
  fetchGetComments,
  fetchGetCommentsByUser,
  fetchCreateComment,
  fetchUpdateComment,
  fetchDeleteComment,
};
