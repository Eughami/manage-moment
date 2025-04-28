import fetch from '@/lib/baseAxios';
export interface CreateTechnique {
  libelle: string;
  date_debut: string;
  date_fin: string;
}
export const getTechniques = async (id: string) => {
  const res = await fetch({
    url: `operations-techniques?filter=project.id||eq||${id}`,
    method: 'GET',
  });
  return res.data;
};

export const createTechnique = async (u: CreateTechnique) => {
  const res = await fetch({
    url: 'operations-techniques',
    method: 'POST',
    data: u,
  });
  return res.data;
};

export const getTechnique = async (id: string) => {
  const res = await fetch({
    url: `operations-techniques/${id}`,
    method: 'GET',
  });

  return res.data;
};

export type UpdateTechnique = {
  id: string;
  payload: CreateTechnique;
};
export const updateTechnique = async (u: UpdateTechnique) => {
  const res = await fetch({
    url: `operations-techniques/${u.id}`,
    method: 'PUT',
    data: u.payload,
  });
  return res.data;
};

export const deleteTechnique = async (id: string) => {
  const res = await fetch({
    url: `operations-techniques/${id}`,
    method: 'DELETE',
  });
  return res.data;
};
