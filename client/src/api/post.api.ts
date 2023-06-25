import apiService from '@app/server';
import { IPost, IQueryPost, IResponse, IUpdatePost, IUser } from '@/utils/interface';

const fetchCreatePost = async ({
  content,
  title,
  background,
  tags,
}: {
  content: string;
  title: string;
  background?: string;
  tags?: string[];
}) => {
  const response = await apiService.post<IResponse<IPost>>('/post/create', {
    content,
    title,
    background,
    tags,
  });

  return response.data.data;
};

const fetchUpdatePost = async (props: IUpdatePost) => {
  const response = await apiService.put<IResponse<IPost>>(
    `/post/update/${props.postId}`,
    {
      ...props,
      isDelete: false,
    },
  );

  return response.data;
};

const fetchDeletePost = async (postId: string) => {
  const response = await apiService.put<IResponse<IPost>>(`/post/update/${postId}`, {
    isDelete: true,
  });

  return response.data;
};

const fetchGetPosts = async (props: IQueryPost) => {
  const response = await apiService.get<IResponse<IPost<IUser>[]>>('/post', {
    params: { ...props, limit: 5 },
  });

  return response.data.data;
};

const getPostsByUser = async (props: IQueryPost) => {
  const response = await apiService.get<IResponse<IPost<IUser>[]>>('/post/user', {
    params: { ...props, limit: 5 },
  });

  return response.data.data;
};

export {
  fetchGetPosts,
  getPostsByUser,
  fetchUpdatePost,
  fetchCreatePost,
  fetchDeletePost,
};
