import regexUtil from '@/utils/regexUtil';
import * as Yup from 'yup';

export const updateUserSchema = Yup.object().shape({
  body: Yup.object().shape({
    name: Yup.string().notRequired(),
    avatar: Yup.string().matches(regexUtil.URL_REGEX, 'Must be url').notRequired(),
    password: Yup.string().notRequired(),
    newPassword: Yup.string().when('password', (password, field) =>
      password[0]
        ? field
            .min(6)
            .notOneOf([Yup.ref('password'), null], 'New password must not same password')
            .required()
        : field.max(0, 'Not input value because you don`t input current password'),
    ),
    confirmPassword: Yup.string().when('newPassword', (newPassword, field) =>
      newPassword[0]
        ? field.oneOf([Yup.ref('newPassword')], 'not match new password').required()
        : field.max(0, 'Not input value because you don`t input newPassword '),
    ),
  }),
});

export type UpdateUserSchema = Yup.InferType<typeof updateUserSchema>['body'];
