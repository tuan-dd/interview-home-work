import { LoaderFunctionArgs } from 'react-router-dom';
import apiService from '@/app/server';
import { IResponse } from './interface';
import { IResGetPosts } from '@/reducer/post/post.slice';

export default async function loaderPosts({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const objectParams = {
    ...Object.fromEntries(url.searchParams.entries()),
  };

  const response = await apiService.get<IResponse<IResGetPosts>>('/post', {
    params: { ...objectParams },
  });
  return {
    posts: response.data.data?.posts,
    count: response.data.data?.count,
    ...objectParams,
  };
}

