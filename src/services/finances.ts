import fetch from '@/lib/baseAxios';
export interface CreateFinance {
  libelle_finan: string;
  depense: number;
  montant_entree: number;
  observation: string;
}
export const getFinances = async (id: string) => {
  const res = await fetch({
    url: `operations-finance?filter=project.id||eq||${id}`,
    method: 'GET',
  });
  return res.data;
};

export const createFinance = async (u: CreateFinance) => {
  const res = await fetch({
    url: 'operations-finance',
    method: 'POST',
    data: u,
  });
  return res.data;
};

export const getFinance = async (id: string) => {
  const res = await fetch({
    url: `operations-finance/${id}`,
    method: 'GET',
  });

  return res.data;
};

export type UpdateFinance = {
  id: string;
  payload: CreateFinance;
};
export const updateFinance = async (u: UpdateFinance) => {
  const res = await fetch({
    url: `operations-finance/${u.id}`,
    method: 'PUT',
    data: u.payload,
  });
  return res.data;
};

export const deleteFinance = async (id: string) => {
  const res = await fetch({
    url: `operations-finance/${id}`,
    method: 'DELETE',
  });
  return res.data;
};
