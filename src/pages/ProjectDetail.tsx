import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { ProjectTabs } from '@/components/project/ProjectTabs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteProject, getProject, updateProject } from '@/services/project';
import { Loader2 } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { getExperts } from '@/services/experts';
import { getBeneficiariess } from '@/services/beneficiaries';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    isLoading: qLoading,
    isFetching,
    data: project,
    refetch,
  } = useQuery({
    queryKey: ['projects', id],
    queryFn: () => getProject(id),
  });

  const { data: experts } = useQuery({
    queryKey: ['experts'],
    queryFn: getExperts,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: beneficiairies } = useQuery({
    queryKey: ['beneficiairies'],
    queryFn: getBeneficiariess,
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      refetch();
      toast.success('Project updated successfully');
      setUpdateDialogOpen(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success('Project deleted successfully');
      setDeleteDialogOpen(false);
      navigate('/');
    },
  });

  const handleUpdateProject = (pr) => {
    const payload = { ...pr };
    payload.beneficiaire = {
      id: pr.beneficiaire_id,
    };
    payload.expert = {
      id: pr.expert_id,
    };
    updateMutation.mutate({ id: project.id, payload });
  };

  if (qLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader
        project={project}
        onEdit={setUpdateDialogOpen}
        onDel={setDeleteDialogOpen}
        onBackClick={() => navigate('/')}
      />
      <div className="container py-6">
        <ProjectTabs project={project} />
      </div>

      {/* Edit Project Dialog */}
      <CreateProjectDialog
        open={updateDialogOpen}
        setOpen={setUpdateDialogOpen}
        onSubmit={handleUpdateProject}
        initialData={project || undefined}
        mode="edit"
        experts={experts?.data || []}
        beneficiairies={beneficiairies?.data || []}
        loading={updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={() => deleteMutation.mutate(project?.id)}
        title="Delete Project"
        description={`Are you sure you want to delete "${project?.nom}"? This action cannot be undone and will remove all tasks and files associated with this project.`}
      />
    </div>
  );
};

export default ProjectDetail;
