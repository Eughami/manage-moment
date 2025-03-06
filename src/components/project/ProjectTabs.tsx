
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/TaskList";
import { FileGrid } from "@/components/FileGrid";
import ProjectOverview from "@/components/ProjectOverview";
import { Task, TaskStatus, File, User } from "@/services/api";

interface ProjectTabsProps {
  projectId?: string;
  tasks: Task[];
  files: File[];
  currentUser: User;
  onTaskSelect: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: () => void;
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
  onFileDelete: (fileId: string) => void;
  onFileUpload: (file: Omit<File, "id" | "projectId" | "uploadedAt">) => void;
}

export function ProjectTabs({
  projectId,
  tasks,
  files,
  currentUser,
  onTaskSelect,
  onTaskDelete,
  onAddTask,
  onTaskStatusChange,
  onFileDelete,
  onFileUpload,
}: ProjectTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="list">List</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <ProjectOverview projectId={projectId} />
      </TabsContent>
      <TabsContent value="list">
        <TaskList
          tasks={tasks}
          onTaskSelect={onTaskSelect}
          onTaskDelete={onTaskDelete}
          onAddTask={onAddTask}
          onTaskStatusChange={onTaskStatusChange}
        />
      </TabsContent>
      <TabsContent value="files">
        <FileGrid
          files={files}
          onFileDelete={onFileDelete}
          onFileUpload={onFileUpload}
          currentUser={currentUser}
        />
      </TabsContent>
    </Tabs>
  );
}
