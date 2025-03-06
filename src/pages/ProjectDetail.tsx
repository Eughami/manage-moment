
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Task, TaskStatus, File } from "@/services/api";
import { toast } from "sonner";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectTabs } from "@/components/project/ProjectTabs";

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
    toast.info("Opening task details");
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };

  const handleAddTask = () => {
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
    </div>
  );
};

export default ProjectDetail;
