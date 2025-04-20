import fetch from '@/lib/baseAxios';
import { ProjectStatus, ProjectType } from './api';
export interface CreateProject {
  nom: string;
  status: ProjectStatus;
  type_projet: ProjectType;
  date_acquisition: string;
  date_debut: string;
  date_fin: string;
  date_cloture: string;
  beneficiaire_id: string;
  expert_id: string;
  budget: number;
}
export const getProjects = async () => {
  const res = await fetch({
    url: 'projects',
    method: 'GET',
  });
  return res.data;
};

export const createProject = async (u: CreateProject) => {
  const res = await fetch({
    url: 'projects',
    method: 'POST',
    data: u,
  });
  return res.data;
};

export const getProject = async (id: string) => {
  const res = await fetch({
    url: `projects/${id}`,
    method: 'GET',
  });

  return res.data;
};

type UpdateProject = {
  id: string;
  payload: CreateProject;
};
export const updateProject = async (u: UpdateProject) => {
  const res = await fetch({
    url: `projects/${u.id}`,
    method: 'PUT',
    data: u.payload,
  });
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await fetch({
    url: `projects/${id}`,
    method: 'DELETE',
  });
  return res.data;
};
