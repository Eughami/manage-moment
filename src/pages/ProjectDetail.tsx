
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskList } from "@/components/TaskList";
import { FileGrid } from "@/components/FileGrid";
import ProjectOverview from "@/components/ProjectOverview";
import { useState } from "react";
import { Task, TaskStatus, File } from "@/services/api";
import { toast } from "sonner";

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

  const handleTaskSelect = (task: Task) => {
    // In a real app, this would open the task detail sidebar
    toast.info("Opening task details");
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };

  const handleAddTask = () => {
    // In a real app, this would open the create task dialog
    toast.info("Opening create task dialog");
  };

  const handleTaskStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    toast.success("Task status updated");
  };

  const handleFileDelete = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    toast.success("File deleted successfully");
  };

  const handleFileUpload = (file: Omit<File, "id" | "projectId" | "uploadedAt">) => {
    const newFile: File = {
      id: Date.now().toString(),
      projectId: id!,
      uploadedAt: new Date().toISOString(),
      ...file,
    };
    setFiles([...files, newFile]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center h-16 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/projects")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold flex-1">Project Name</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container py-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <ProjectOverview projectId={id} />
          </TabsContent>
          <TabsContent value="list">
            <TaskList
              tasks={tasks}
              onTaskSelect={handleTaskSelect}
              onTaskDelete={handleTaskDelete}
              onAddTask={handleAddTask}
              onTaskStatusChange={handleTaskStatusChange}
            />
          </TabsContent>
          <TabsContent value="files">
            <FileGrid
              files={files}
              onFileDelete={handleFileDelete}
              onFileUpload={handleFileUpload}
              currentUser={MOCK_USER}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;
