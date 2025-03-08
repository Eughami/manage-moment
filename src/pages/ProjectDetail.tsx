import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Task, TaskStatus, File, api } from "@/services/api";
import { toast } from "sonner";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectTabs } from "@/components/project/ProjectTabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TaskEditDialog } from "@/components/TaskEditDialog";

const MOCK_USER = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg"
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as "low" | "medium" | "high",
    dueDate: null as string | null
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api.getTasks(id).then(fetchedTasks => {
        setTasks(fetchedTasks);
      }).catch(error => {
        console.error("Failed to load tasks:", error);
        toast.error("Failed to load tasks");
      });

      api.getFiles(id).then(fetchedFiles => {
        setFiles(fetchedFiles);
      }).catch(error => {
        console.error("Failed to load files:", error);
        toast.error("Failed to load files");
      });
    }
  }, [id]);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskOpen(true);
  };

  const handleTaskDelete = (taskId: string) => {
    if (!id) return;
    
    api.deleteTask(id, taskId)
      .then(success => {
        if (success) {
          setTasks(tasks.filter(task => task.id !== taskId));
          toast.success("Task deleted successfully");
        } else {
          toast.error("Failed to delete task");
        }
      })
      .catch(error => {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      });
  };

  const handleAddTask = () => {
    setIsAddTaskOpen(true);
  };

  const handleCreateTask = async () => {
    if (!id) return;
    
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
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
        assignee: MOCK_USER
      });
      
      if (createdTask) {
        setTasks([...tasks, createdTask]);
        toast.success("Task created successfully");
        setIsAddTaskOpen(false);
        
        setNewTask({
          title: "",
          description: "",
          status: "todo",
          priority: "medium",
          dueDate: null
        });
      } else {
        toast.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (updates: Partial<Task>) => {
    if (!id || !selectedTask) return;
    
    if (updates.title && !updates.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsLoading(true);
    
    try {
      const updatedTask = await api.updateTask(id, selectedTask.id, updates);
      
      if (updatedTask) {
        setTasks(tasks.map(task => 
          task.id === selectedTask.id ? { ...task, ...updates } : task
        ));
        toast.success("Task updated successfully");
        setIsEditTaskOpen(false);
        setSelectedTask(null);
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskStatusChange = (taskId: string, status: TaskStatus) => {
    if (!id) return;
    
    api.updateTask(id, taskId, { status })
      .then(updatedTask => {
        if (updatedTask) {
          setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, status } : task
          ));
          toast.success("Task status updated");
        } else {
          toast.error("Failed to update task status");
        }
      })
      .catch(error => {
        console.error("Error updating task status:", error);
        toast.error("Failed to update task status");
      });
  };

  const handleFileDelete = (fileId: string) => {
    if (!id) return;
    
    api.deleteFile(id, fileId)
      .then(success => {
        if (success) {
          setFiles(files.filter(file => file.id !== fileId));
          toast.success("File deleted successfully");
        } else {
          toast.error("Failed to delete file");
        }
      })
      .catch(error => {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete file");
      });
  };

  const handleFileUpload = (file: Omit<File, "id" | "projectId" | "uploadedAt">) => {
    if (!id) return;
    
    api.uploadFile(id, file)
      .then(uploadedFile => {
        if (uploadedFile) {
          setFiles([...files, uploadedFile]);
          toast.success("File uploaded successfully");
        } else {
          toast.error("Failed to upload file");
        }
      })
      .catch(error => {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file");
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader onBackClick={() => navigate("/projects")} />
      <div className="container py-6">
        <ProjectTabs
          projectId={id}
          tasks={tasks}
          files={files}
          currentUser={MOCK_USER}
          onTaskSelect={handleTaskSelect}
          onTaskDelete={handleTaskDelete}
          onAddTask={handleAddTask}
          onTaskStatusChange={handleTaskStatusChange}
          onFileDelete={handleFileDelete}
          onFileUpload={handleFileUpload}
        />
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value as TaskStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as "low" | "medium" | "high" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate || ''}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value || null })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTask} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <TaskEditDialog
        task={selectedTask}
        isOpen={isEditTaskOpen}
        onOpenChange={setIsEditTaskOpen}
        onSave={handleUpdateTask}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectDetail;
