import { JwtPayload } from 'jwt-decode';
import React from 'react';
import { EKeyHeader, ERole } from './enum';

interface ITimestamps {
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
}

export interface IAuthor {
  name: string;
  _id: string;
  avatar: string;
}

export interface JwtPayloadUser extends JwtPayload {
  email: string;
  role: ERole;
}

export interface IResponse<T = any> {
  data: T | null;
  message: string;
}

export type KeyHeaderValue =
  | EKeyHeader.ACCESS_TOKEN
  | EKeyHeader.USER_ID
  | EKeyHeader.REFRESH_TOKEN;

export interface IUser extends ITimestamps {
  name: string;
  email: string;
  isVerify?: boolean;
  avatar: string;
  role: ERole;
  isHaveOtp: boolean;
  isActive?: boolean;
}

export interface IPost<A = string> extends ITimestamps {
  title: string;
  content: string;
  background?: string;
  cmt_count?: number;
  authorId?: A;
  tags: string[];
}

export interface IComment<A = string, P = string> extends ITimestamps {
  content: string;
  postId: A;
  slug: string;
  parentSlug: string;
  authorId: P;
  reply_count: number;
  replies?: IComment<string, IAuthor>[];
}

export interface IUpdateMe {
  name: string;
  avatar: string;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ICreatePost {
  content: string;
  title: string;
  background?: string;
  tags?: string[];
}

export interface IUpdatePost {
  content: string;
  title: string;
  background: string;
  tags: string[];
  isDelete?: boolean;
  postId: string;
}

export interface IQueryPost {
  content?: string;
  search?: string;
  page: number;
  title?: string;
  tags?: string[];
  author?: string;
  createdAt_gte?: string;
  createdAt_lte?: string;
  [k: string]: any;
}

export interface ISignUp {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IConTextRouter {
  setIsOpenModalSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PropsForm {
  name: string;
  children?: React.ReactNode[];
}
