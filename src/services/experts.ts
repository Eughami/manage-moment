import fetch from '@/lib/baseAxios';
export interface CreateExpert {
  nom: string;
  specialite: string;
  tel: string;
}
export const getExperts = async () => {
  const res = await fetch({
    url: 'experts',
    method: 'GET',
  });
  return res.data;
};

export const createExpert = async (u: CreateExpert) => {
  const res = await fetch({
    url: 'experts',
    method: 'POST',
    data: u,
  });
  return res.data;
};

export const getExpert = async (id: string) => {
  const res = await fetch({
    url: `experts/${id}`,
    method: 'GET',
  });

  return res.data;
};

type UpdateExpert = {
  id: string;
  payload: CreateExpert;
};
export const updateExpert = async (u: UpdateExpert) => {
  const res = await fetch({
    url: `experts/${u.id}`,
    method: 'PUT',
    data: u.payload,
  });
  return res.data;
};

export const deleteExpert = async (id: string) => {
  const res = await fetch({
    url: `experts/${id}`,
    method: 'DELETE',
  });
  return res.data;
};
