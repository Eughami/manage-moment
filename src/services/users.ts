import fetch from '@/lib/baseAxios';
export interface CreateUser {
  name: string;
  email: string;
  password: string;
  role: string;
}
export const getUsers = async () => {
  const res = await fetch({
    url: 'users',
    method: 'GET',
  });
  return res.data;
};

export const createUser = async (u: CreateUser) => {
  const res = await fetch({
    url: 'users',
    method: 'POST',
    data: u,
  });
  return res.data;
};

export const getUser = async (id: string) => {
  const res = await fetch({
    url: `users/${id}`,
    method: 'GET',
  });

  return res.data;
};

type UpdateUser = {
  id: string;
  payload: Omit<CreateUser, 'password'>;
};
export const updateUser = async (u: UpdateUser) => {
  const res = await fetch({
    url: `users/${u.id}`,
    method: 'PUT',
    data: u.payload,
  });
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await fetch({
    url: `users/${id}`,
    method: 'DELETE',
  });
  return res.data;
};
