import apiService from '@app/server';
import { ILogin, IResponseLogin } from '@reducer/auth/auth.slice';
import { IResponse, ISignUp, IUser } from '@utils/interface';

export const fetchSignIn = async ({ email, password }: ILogin) => {
  const response = await apiService.post<IResponse<IResponseLogin>>('/auth/sign-in', {
    email,
    password,
  });

  return response.data.data;
};

export const fetchSignOut = async () => {
  const response = await apiService.post('/auth/sign-out');

  return response.data;
};

export const fetchNewAccessToken = async () => {
  const response = await apiService.get<IResponse<string>>('/auth/new-access-token');

  const newAccessToken = response.data.data;

  return newAccessToken;
};

export const fetchSignUp = async (props: ISignUp) => {
  const response = await apiService.post<IResponse<IUser>>('/auth/sign-up', {
    ...props,
  });

  return response.data.data;
};
