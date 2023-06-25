export enum EStatusRedux {
  idle = 'idle',
  pending = 'pending',
  succeeded = 'succeeded',
  error = 'error',
}

export enum EPackage {
  FREE = 'FREE',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum ERole {
  HOTELIER = 'HOTELIER',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum EKeyHeader {
  USER_ID = 'x-client-id',
  REFRESH_TOKEN = 'x-rtoken-id',
  ACCESS_TOKEN = 'x-atoken-id',
}

export const colors = [
  'magenta',
  'orange',
  'red',
  'volcano',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
];
