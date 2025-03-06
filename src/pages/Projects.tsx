
import { useState, useEffect } from "react";
import { Project, api, ProjectStatus, ProjectType } from "@/services/api";
import { ProjectCard } from "@/components/ProjectCard";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { SortFilterBar, SortFilterOptions, SortOption } from "@/components/SortFilterBar";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [filterOptions, setFilterOptions] = useState<SortFilterOptions>({
    search: "",
    type: "all",
    status: "all",
    date: undefined,
    sort: "newest" as SortOption,
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (project: any) => {
    try {
      await api.createProject(project);
      await fetchProjects();
      setCreateDialogOpen(false);
      toast.success("Project created successfully");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  const handleEditProject = async (project: any) => {
    if (!projectToEdit) return;

    try {
      await api.updateProject(projectToEdit.id, project);
      await fetchProjects();
      setEditDialogOpen(false);
      setProjectToEdit(null);
      toast.success("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await api.deleteProject(projectToDelete.id);
      await fetchProjects();
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  // Filter and sort projects based on the current filter options
  const filteredProjects = projects
    .filter((project) => {
      // Search filter
      if (
        filterOptions.search &&
        !project.title.toLowerCase().includes(filterOptions.search.toLowerCase()) &&
        !project.description.toLowerCase().includes(filterOptions.search.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (filterOptions.type !== "all" && project.type !== filterOptions.type) {
        return false;
      }

      // Status filter
      if (filterOptions.status !== "all" && project.status !== filterOptions.status) {
        return false;
      }

      // Date filter
      if (filterOptions.date) {
        const projectDate = new Date(project.updatedAt);
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
        case "newest":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "oldest":
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "status":
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md rounded-xl border p-12 text-center">
          {projects.length === 0 ? (
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
              <h3 className="text-xl font-semibold mb-2">No matching projects</h3>
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
              onEdit={(project) => {
                setProjectToEdit(project);
                setEditDialogOpen(true);
              }}
              onDelete={(project) => {
                setProjectToDelete(project);
                setDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        setOpen={setCreateDialogOpen}
        onSubmit={handleCreateProject}
        mode="create"
      />

      {/* Edit Project Dialog */}
      <CreateProjectDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onSubmit={handleEditProject}
        initialData={projectToEdit || undefined}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone and will remove all tasks and files associated with this project.`}
      />
    </div>
  );
}
