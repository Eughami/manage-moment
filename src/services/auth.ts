import { PUBLIC_REQUEST_KEY } from '@/constants/auth';
import fetch from '@/lib/baseAxios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  accessToken: string;
}

export const loginFunc = async (payload: LoginCredentials) => {
  const res = await fetch({
    url: 'auth/login',
    method: 'POST',
    headers: {
      [PUBLIC_REQUEST_KEY]: 'true',
    },
    data: payload,
  });

  return res;
};
