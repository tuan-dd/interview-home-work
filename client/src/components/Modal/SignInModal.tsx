import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { shallowEqual, useSelector } from 'react-redux';
import { Button, Space } from 'antd';
import BasicModal from './BasicModal';
import { ILogin, authAction } from '@/reducer/auth/auth.slice';
import { RootState, useAppDispatch } from '@/app/store';
import { FInput, FInputPassword, FormProvider } from '../formProvider';
import { EStatusRedux } from '@/utils/enum';
import { Text } from '@/utils/utils';

const defaultValues: ILogin = {
  email: 'tuandd.310797@gmail.com',
  password: 'tuan123',
};

const validate = z.object({
  email: z.string().email(),
  password: z.string(),
});

function SignInModal({
  isOpenModal,
  setIsOpenModal,
  setIsOpenModalSignUp,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModalSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const methods = useForm<ILogin>({
    defaultValues,
    resolver: zodResolver(validate),
  });

  const { status, isSignIn, errorMessage } = useSelector(
    (state: RootState) => ({
      status: state.auth.status,
      isSignIn: state.auth.isSignIn,
      errorMessage: state.auth.errorMessage,
    }),
    shallowEqual,
  );

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<ILogin> = (data) => {
    dispatch(authAction.signInPending(data));
  };

  React.useEffect(() => {
    if (isSignIn) setIsOpenModal(false);
  }, [isSignIn]);

  const handelOpenSignUp = () => {
    setIsOpenModalSignUp(true);
    setIsOpenModal(false);
  };

  return (
    <BasicModal
      isOpenModal={isOpenModal}
      setIsOpenModal={setIsOpenModal}
      title=' Sign Ip'
      style={{ textAlign: 'center' }}
    >
      <FormProvider onSubmit={onSubmit} {...methods}>
        <Space direction='vertical' style={{ rowGap: 10, width: 300 }} align='center'>
          <Button onClick={() => handelOpenSignUp()} type='link'>
            Sign Up Now
          </Button>
          {errorMessage && <Text type='danger'>{errorMessage} </Text>}
          <FInput name='email' placeholder='Input your email' style={{ minWidth: 200 }} />
          <FInputPassword
            name='password'
            placeholder='Input your password'
            style={{ minWidth: 200 }}
          />
          <Button htmlType='submit' loading={status === EStatusRedux.pending}>
            Sign In
          </Button>
        </Space>
      </FormProvider>
    </BasicModal>
  );
}

export default SignInModal;
