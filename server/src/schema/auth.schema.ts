import * as Yup from 'yup';

import regexUtil from '@/utils/regexUtil';

export const signInSchema = Yup.object().shape({
  body: Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  }),
});

export const forgetPwdSchema = Yup.object().shape({
  body: Yup.object().shape({
    email: Yup.string().email().required(),
    newPwd: Yup.string().min(6).required(),
    confirmPwd: Yup.string()
      .oneOf([Yup.ref('newPwd')], 'confirm same password')
      .required(),
    token: Yup.number().required(),
  }),
});

export const signUpSchema = Yup.object().shape({
  body: Yup.object().shape({
    name: Yup.string().min(4).max(30).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
    avatar: Yup.string().matches(regexUtil.URL_REGEX, 'Must be url').notRequired(),
  }),
});

export type SignUpSchema = Yup.InferType<typeof signUpSchema>['body'];
export type SignInSchema = Yup.InferType<typeof signInSchema>['body'];
export type ForgetPwdSchema = Yup.InferType<typeof forgetPwdSchema>['body'];
