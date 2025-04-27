import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Task, TaskStatus, File, api } from '@/services/api';
import { toast } from 'sonner';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { ProjectTabs } from '@/components/project/ProjectTabs';
import { TaskDrawer } from '@/components/TaskDrawer';
import { NewTaskDrawer } from '@/components/NewTaskDrawer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteProject, getProject, updateProject } from '@/services/project';
import { Loader2 } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { getExperts } from '@/services/experts';
import { getBeneficiariess } from '@/services/beneficiaries';

const MOCK_USER = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/placeholder.svg',
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (id) {
      api
        .getTasks(id)
        .then((fetchedTasks) => {
          setTasks(fetchedTasks);
        })
        .catch((error) => {
          console.error('Failed to load tasks:', error);
          toast.error('Failed to load tasks');
        });

      api
        .getFiles(id)
        .then((fetchedFiles) => {
          setFiles(fetchedFiles);
        })
        .catch((error) => {
          console.error('Failed to load files:', error);
          toast.error('Failed to load files');
        });
    }
  }, [id]);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskOpen(true);
  };

  const handleTaskDelete = (taskId: string) => {
    if (!id) return;

    api
      .deleteTask(id, taskId)
      .then((success) => {
        if (success) {
          setTasks(tasks.filter((task) => task.id !== taskId));
          toast.success('Task deleted successfully');
          setIsEditTaskOpen(false);
        } else {
          toast.error('Failed to delete task');
        }
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      });
  };

  const handleAddTask = () => {
    setIsAddTaskOpen(true);
  };

  const handleCreateTask = async (newTask: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: 'low' | 'medium' | 'high';
    dueDate: string | null;
  }) => {
    if (!id) return;

    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsLoading(true);

    try {
      const createdTask = await api.createTask(id, {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        assignee: MOCK_USER,
      });

      if (createdTask) {
        setTasks([...tasks, createdTask]);
        toast.success('Task created successfully');
        setIsAddTaskOpen(false);
      } else {
        toast.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (updates: Partial<Task>) => {
    if (!id || !selectedTask) return;

    if (updates.title && !updates.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsLoading(true);

    try {
      const updatedTask = await api.updateTask(id, selectedTask.id, updates);

      if (updatedTask) {
        setTasks(
          tasks.map((task) =>
            task.id === selectedTask.id ? { ...task, ...updates } : task
          )
        );
        toast.success('Task updated successfully');
        setIsEditTaskOpen(false);
        setSelectedTask(null);
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskStatusChange = (taskId: string, status: TaskStatus) => {
    if (!id) return;

    api
      .updateTask(id, taskId, { status })
      .then((updatedTask) => {
        if (updatedTask) {
          setTasks(
            tasks.map((task) =>
              task.id === taskId ? { ...task, status } : task
            )
          );
          toast.success('Task status updated');
        } else {
          toast.error('Failed to update task status');
        }
      })
      .catch((error) => {
        console.error('Error updating task status:', error);
        toast.error('Failed to update task status');
      });
  };

  const handleFileDelete = (fileId: string) => {
    if (!id) return;

    api
      .deleteFile(id, fileId)
      .then((success) => {
        if (success) {
          setFiles(files.filter((file) => file.id !== fileId));
          toast.success('File deleted successfully');
        } else {
          toast.error('Failed to delete file');
        }
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
        toast.error('Failed to delete file');
      });
  };

  const handleFileUpload = (
    file: Omit<File, 'id' | 'projectId' | 'uploadedAt'>
  ) => {
    if (!id) return;

    api
      .uploadFile(id, file)
      .then((uploadedFile) => {
        if (uploadedFile) {
          setFiles([...files, uploadedFile]);
          toast.success('File uploaded successfully');
        } else {
          toast.error('Failed to upload file');
        }
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload file');
      });
  };

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
    console.log(pr);
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
        <ProjectTabs
          project={project}
          // tasks={tasks}
          // files={files}
          // currentUser={MOCK_USER}
          // onTaskSelect={handleTaskSelect}
          // onTaskDelete={handleTaskDelete}
          // onAddTask={handleAddTask}
          // onTaskStatusChange={handleTaskStatusChange}
          // onFileDelete={handleFileDelete}
          // onFileUpload={handleFileUpload}
        />
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

      {/* Task Drawer Components */}
      <NewTaskDrawer
        isOpen={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onCreateTask={handleCreateTask}
        isLoading={isLoading}
      />

      <TaskDrawer
        task={selectedTask}
        isOpen={isEditTaskOpen}
        onOpenChange={setIsEditTaskOpen}
        onSave={handleUpdateTask}
        onDelete={handleTaskDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectDetail;
