// Types
export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'cancelled';
export type ProjectType = 'development' | 'design' | 'marketing' | 'research';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Project {
  id: string;
  nom: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  type_projet: ProjectType;
  date_acquisition: string;
  date_debut: string;
  date_fin: string;
  date_cloture: string;
  beneficiaire_id: string;
  expert_id: string;
  created_at: string;
  updated_at: string;
  tasks: Task[];
  files: File[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: User;
  dueDate: string | null;
  status: TaskStatus;
  priority: Priority;
  createdAt: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar: string;
}

export interface File {
  id: string;
  projectId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl: string;
  uploadedAt: string;
  uploadedBy: User;
}

// Mock data
const users: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'user-2',
    name: 'Jamie Smith',
    email: 'jamie@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 'user-3',
    name: 'Taylor Wilson',
    email: 'taylor@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 'user-4',
    name: 'Morgan Lee',
    email: 'morgan@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

// Generate mock projects data
let mockProjects: Project[] = Array.from({ length: 10 }).map((_, index) => {
  const id = `project-${index + 1}`;
  const type = ['development', 'design', 'marketing', 'research'][
    Math.floor(Math.random() * 4)
  ] as ProjectType;
  const status = ['active', 'completed', 'on-hold', 'cancelled'][
    Math.floor(Math.random() * 4)
  ] as ProjectStatus;
  const createdAt = new Date(
    Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
  ).toISOString();
  const updatedAt = new Date(
    new Date(createdAt).getTime() +
      Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  ).toISOString();

  // Generate mock tasks for this project
  const tasks = Array.from({ length: Math.floor(Math.random() * 5) + 2 }).map(
    (_, tIndex) => {
      const taskId = `task-${index}-${tIndex}`;
      const assignee = users[Math.floor(Math.random() * users.length)];
      const taskStatus = ['todo', 'in-progress', 'review', 'done'][
        Math.floor(Math.random() * 4)
      ] as TaskStatus;
      const priority = ['low', 'medium', 'high'][
        Math.floor(Math.random() * 3)
      ] as Priority;
      const dueDate =
        Math.random() > 0.2
          ? new Date(
              Date.now() +
                (Math.floor(Math.random() * 14) - 7) * 24 * 60 * 60 * 1000
            ).toISOString()
          : null;

      return {
        id: taskId,
        projectId: id,
        title: `Task ${tIndex + 1} for Project ${index + 1}`,
        description: `This is the description for task ${
          tIndex + 1
        } of project ${index + 1}.`,
        assignee,
        dueDate,
        status: taskStatus,
        priority,
        createdAt: new Date(
          new Date(createdAt).getTime() +
            Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
    }
  );

  // Generate mock files for this project
  const files = Array.from({ length: Math.floor(Math.random() * 6) + 1 }).map(
    (_, fIndex) => {
      const fileId = `file-${index}-${fIndex}`;
      const fileTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/docx',
        'text/plain',
      ];
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
      const fileName = `File-${fIndex + 1}-${
        ['Document', 'Screenshot', 'Report', 'Mockup'][
          Math.floor(Math.random() * 4)
        ]
      }.${fileType.split('/')[1]}`;
      const fileSize = Math.floor(Math.random() * 5000) + 50; // KB

      return {
        id: fileId,
        projectId: id,
        name: fileName,
        type: fileType,
        size: fileSize,
        url: '#',
        thumbnailUrl: fileType.includes('image')
          ? `https://picsum.photos/seed/${fileId}/400/300`
          : `/placeholder.svg`,
        uploadedAt: new Date(
          new Date(createdAt).getTime() +
            Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000
        ).toISOString(),
        uploadedBy: users[Math.floor(Math.random() * users.length)],
      };
    }
  );

  return {
    id,
    title: `Project ${index + 1}`,
    description: `This is a ${type} project that is currently ${status}.`,
    status,
    type,
    createdAt,
    updatedAt,
    tasks,
    files,
  };
});

// API client
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate network delay
const simulateNetwork = async <T>(data: T): Promise<T> => {
  await delay(Math.random() * 800 + 200); // 200-1000ms delay
  return data;
};

export const api = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    return simulateNetwork([...mockProjects]);
  },

  getProject: async (id: string): Promise<Project | undefined> => {
    const project = mockProjects.find((p) => p.id === id);
    return simulateNetwork(project);
  },

  createProject: async (
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks' | 'files'>
  ): Promise<Project> => {
    const newProject: Project = {
      id: `project-${mockProjects.length + 1}`,
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [],
      files: [],
    };

    mockProjects.push(newProject);
    return simulateNetwork(newProject);
  },

  updateProject: async (
    id: string,
    updates: Partial<Project>
  ): Promise<Project | undefined> => {
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    mockProjects[index] = {
      ...mockProjects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return simulateNetwork(mockProjects[index]);
  },

  deleteProject: async (id: string): Promise<boolean> => {
    const initialLength = mockProjects.length;
    mockProjects = mockProjects.filter((p) => p.id !== id);
    return simulateNetwork(initialLength > mockProjects.length);
  },

  // Tasks
  getTasks: async (projectId: string): Promise<Task[]> => {
    const project = mockProjects.find((p) => p.id === projectId);
    return simulateNetwork(project?.tasks || []);
  },

  getTask: async (
    projectId: string,
    taskId: string
  ): Promise<Task | undefined> => {
    const project = mockProjects.find((p) => p.id === projectId);
    const task = project?.tasks.find((t) => t.id === taskId);
    return simulateNetwork(task);
  },

  createTask: async (
    projectId: string,
    task: Omit<Task, 'id' | 'projectId' | 'createdAt'>
  ): Promise<Task | undefined> => {
    const projectIndex = mockProjects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) return undefined;

    const newTask: Task = {
      id: `task-${projectId}-${mockProjects[projectIndex].tasks.length + 1}`,
      projectId,
      ...task,
      createdAt: new Date().toISOString(),
    };

    mockProjects[projectIndex].tasks.push(newTask);
    mockProjects[projectIndex].updatedAt = new Date().toISOString();

    return simulateNetwork(newTask);
  },

  updateTask: async (
    projectId: string,
    taskId: string,
    updates: Partial<Task>
  ): Promise<Task | undefined> => {
    const projectIndex = mockProjects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) return undefined;

    const taskIndex = mockProjects[projectIndex].tasks.findIndex(
      (t) => t.id === taskId
    );
    if (taskIndex === -1) return undefined;

    mockProjects[projectIndex].tasks[taskIndex] = {
      ...mockProjects[projectIndex].tasks[taskIndex],
      ...updates,
    };

    mockProjects[projectIndex].updatedAt = new Date().toISOString();

    return simulateNetwork(mockProjects[projectIndex].tasks[taskIndex]);
  },

  deleteTask: async (projectId: string, taskId: string): Promise<boolean> => {
    const projectIndex = mockProjects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) return false;

    const initialLength = mockProjects[projectIndex].tasks.length;
    mockProjects[projectIndex].tasks = mockProjects[projectIndex].tasks.filter(
      (t) => t.id !== taskId
    );

    mockProjects[projectIndex].updatedAt = new Date().toISOString();

    return simulateNetwork(
      initialLength > mockProjects[projectIndex].tasks.length
    );
  },

  // Files
  getFiles: async (projectId: string): Promise<File[]> => {
    const project = mockProjects.find((p) => p.id === projectId);
    return simulateNetwork(project?.files || []);
  },

  getFile: async (
    projectId: string,
    fileId: string
  ): Promise<File | undefined> => {
    const project = mockProjects.find((p) => p.id === projectId);
    const file = project?.files.find((f) => f.id === fileId);
    return simulateNetwork(file);
  },

  uploadFile: async (
    projectId: string,
    file: Omit<File, 'id' | 'projectId' | 'uploadedAt'>
  ): Promise<File | undefined> => {
    const projectIndex = mockProjects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) return undefined;

    const newFile: File = {
      id: `file-${projectId}-${mockProjects[projectIndex].files.length + 1}`,
      projectId,
      ...file,
      uploadedAt: new Date().toISOString(),
    };

    mockProjects[projectIndex].files.push(newFile);
    mockProjects[projectIndex].updatedAt = new Date().toISOString();

    return simulateNetwork(newFile);
  },

  deleteFile: async (projectId: string, fileId: string): Promise<boolean> => {
    const projectIndex = mockProjects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) return false;

    const initialLength = mockProjects[projectIndex].files.length;
    mockProjects[projectIndex].files = mockProjects[projectIndex].files.filter(
      (f) => f.id !== fileId
    );

    mockProjects[projectIndex].updatedAt = new Date().toISOString();

    return simulateNetwork(
      initialLength > mockProjects[projectIndex].files.length
    );
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    return simulateNetwork([...users]);
  },
};
