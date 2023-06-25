import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { shallowEqual, useSelector } from 'react-redux';
import { Button, Space } from 'antd';
import BasicModal from './BasicModal';
import { authAction } from '@/reducer/auth/auth.slice';
import { RootState, useAppDispatch } from '@/app/store';
import { FInput, FInputPassword, FormProvider } from '../formProvider';
import { EStatusRedux } from '@/utils/enum';
import { ISignUp } from '@/utils/interface';
import { Text } from '@/utils/utils';

interface ISignUpModal extends ISignUp {
  confirmPassword: string;
}

const defaultValues: ISignUpModal = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const validate = z
  .object({
    name: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // path of error
  });

function SignUpModal({
  isOpenModal,
  setIsOpenModal,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const methods = useForm<ISignUpModal>({
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

  const onSubmit: SubmitHandler<ISignUpModal> = (data) => {
    dispatch(authAction.signUpPending(data));
  };

  React.useEffect(() => {
    if (isSignIn) setIsOpenModal(false);
  }, [isSignIn]);

  return (
    <BasicModal
      isOpenModal={isOpenModal}
      setIsOpenModal={setIsOpenModal}
      style={{ textAlign: 'center' }}
      title=' Sign Up'
    >
      <FormProvider onSubmit={onSubmit} {...methods}>
        <Space direction='vertical' align='center' style={{ rowGap: 10 }}>
          {errorMessage && <Text type='danger'>{errorMessage} </Text>}
          <FInput name='name' placeholder='Input your name' style={{ minWidth: 200 }} />
          <FInput name='email' placeholder='Input your email' style={{ minWidth: 200 }} />
          <FInputPassword
            name='password'
            placeholder='Input your password'
            style={{ minWidth: 200 }}
          />
          <FInputPassword
            name='confirmPassword'
            placeholder='Confirm password'
            style={{ minWidth: 200 }}
          />
          <Button htmlType='submit' loading={status === EStatusRedux.pending}>
            Sign Up
          </Button>
        </Space>
      </FormProvider>
    </BasicModal>
  );
}

export default SignUpModal;
