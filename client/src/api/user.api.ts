import apiService from '@app/server';
import { IResponse, IUpdateMe, IUser } from '@/utils/interface';
import { deleteValueNull } from '@/utils/utils';

const fetchGetMe = async () => {
  const response = await apiService.get<IResponse<IUser>>('/user/me');

  return response.data.data;
};

const fetchUpdateMe = async (props: IUpdateMe) => {
  const deleteKeyNull = deleteValueNull(props);

  const response = await apiService.put('/user/update/me', { ...deleteKeyNull });

  return response.data.data;
};

export { fetchGetMe, fetchUpdateMe };
