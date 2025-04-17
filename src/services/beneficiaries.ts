import fetch from '@/lib/baseAxios';
export interface CreateBeneficiary {
  nom: string;
  address: string;
  tel: string;
}
export const getBeneficiariess = async () => {
  const res = await fetch({
    url: 'beneficiaires',
    method: 'GET',
  });
  return res.data;
};

export const createBeneficiary = async (u: CreateBeneficiary) => {
  const res = await fetch({
    url: 'beneficiaires',
    method: 'POST',
    data: u,
  });
  return res.data;
};

export const getBeneficiary = async (id: string) => {
  const res = await fetch({
    url: `beneficiaires/${id}`,
    method: 'GET',
  });

  return res.data;
};

type UpdateBeneficiaries = {
  id: string;
  payload: CreateBeneficiary;
};
export const updateBeneficiary = async (u: UpdateBeneficiaries) => {
  const res = await fetch({
    url: `beneficiaires/${u.id}`,
    method: 'PUT',
    data: u.payload,
  });
  return res.data;
};

export const deleteBeneficiary = async (id: string) => {
  const res = await fetch({
    url: `beneficiaires/${id}`,
    method: 'DELETE',
  });
  return res.data;
};
