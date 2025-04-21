import { useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import {
  SortFilterBar,
  SortFilterOptions,
  SortOption,
} from '@/components/SortFilterBar';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createProject, getProjects } from '@/services/project';
import { getExperts } from '@/services/experts';
import { getBeneficiariess } from '@/services/beneficiaries';

export default function Projects() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<SortFilterOptions>({
    search: '',
    type_projet: 'all',
    status: 'all',
    date: undefined,
    sort: 'newest' as SortOption,
  });

  const {
    isLoading,
    isFetching,
    data: projects,
    refetch,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    retry: false,
    refetchOnWindowFocus: false,
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
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      refetch();
      toast.success('Project added successfully');
      setCreateDialogOpen(false);
    },
  });

  const handleCreateProject = async (project) => {
    const payload = { ...project };
    payload.beneficiaire = {
      id: project.beneficiaire_id,
    };
    payload.expert = {
      id: project.expert_id,
    };
    createMutation.mutate(payload);
  };

  // Filter and sort projects based on the current filter options
  const filteredProjects = (projects?.data || [])
    .filter((project) => {
      // Search filter
      if (
        filterOptions.search &&
        !project.nom
          .toLowerCase()
          .includes(filterOptions.search.toLowerCase()) &&
        !project.description
          .toLowerCase()
          .includes(filterOptions.search.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (
        filterOptions.type_projet !== 'all' &&
        project.type_projet !== filterOptions.type_projet
      ) {
        return false;
      }

      // Status filter
      if (
        filterOptions.status !== 'all' &&
        project.status !== filterOptions.status
      ) {
        return false;
      }

      // Date filter
      if (filterOptions.date) {
        const projectDate = new Date(project.updated_at);
        const filterDate = filterOptions.date;

        if (
          projectDate.getDate() !== filterDate.getDate() ||
          projectDate.getMonth() !== filterDate.getMonth() ||
          projectDate.getFullYear() !== filterDate.getFullYear()
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Sort
      switch (filterOptions.sort) {
        case 'newest':
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case 'oldest':
          return (
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          );
        case 'alphabetical':
          return a.title.localeCompare(b.nom);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  return (
    <div className="page-container min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="section-title text-3xl">Projects</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <SortFilterBar options={filterOptions} onChange={setFilterOptions} />

      {isLoading || isFetching ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md rounded-xl border p-12 text-center">
          {projects?.data.length === 0 ? (
            <>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first project to get started.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">
                No matching projects
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        setOpen={setCreateDialogOpen}
        onSubmit={handleCreateProject}
        loading={createMutation.isPending}
        mode="create"
        experts={experts?.data || []}
        beneficiairies={beneficiairies?.data || []}
      />
    </div>
  );
}
