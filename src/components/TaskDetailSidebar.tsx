
import { useRef, useState } from "react";
import { format } from "date-fns";
import { Task, TaskStatus, Priority, User } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Calendar, Clock, Flag, User as UserIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface TaskDetailSidebarProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  users: User[];
}

export function TaskDetailSidebar({
  task,
  onClose,
  onSave,
  onDelete,
  users,
}: TaskDetailSidebarProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [isEditing, setIsEditing] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  if (!task || !editedTask) return null;

  const handleSave = () => {
    if (isEditing && editedTask) {
      onSave(editedTask);
      setIsEditing(false);
    } else {
      setIsEditing(true);
      // Focus the title input after state update
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 0);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "bg-slate-100 text-slate-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-amber-100 text-amber-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[420px] bg-white border-l shadow-lg animate-slide-in-right z-50 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="text-xl font-semibold">Task Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-1">
          {isEditing ? (
            <Input
              ref={titleInputRef}
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="text-xl font-semibold mb-1"
            />
          ) : (
            <h3 className="text-xl font-semibold">{editedTask.title}</h3>
          )}
          <div className="text-sm text-muted-foreground">
            Created on {format(new Date(editedTask.createdAt), "MMMM d, yyyy")}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={cn(getStatusColor(editedTask.status))}>
              {editedTask.status
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>
            <Badge className={cn(getPriorityColor(editedTask.priority))}>
              {editedTask.priority.charAt(0).toUpperCase() + editedTask.priority.slice(1)} Priority
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-sm font-medium flex items-center">
                <UserIcon className="h-4 w-4 mr-1 opacity-70" />
                Assignee
              </div>
              {isEditing ? (
                <Select
                  value={editedTask.assignee.id}
                  onValueChange={(value) => {
                    const selectedUser = users.find((u) => u.id === value);
                    if (selectedUser) {
                      setEditedTask({
                        ...editedTask,
                        assignee: selectedUser,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={editedTask.assignee.avatar} alt={editedTask.assignee.name} />
                    <AvatarFallback>{getInitials(editedTask.assignee.name)}</AvatarFallback>
                  </Avatar>
                  <span>{editedTask.assignee.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 opacity-70" />
                Due Date
              </div>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editedTask.dueDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {editedTask.dueDate ? (
                        format(new Date(editedTask.dueDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                      onSelect={(date) => 
                        setEditedTask({
                          ...editedTask,
                          dueDate: date ? date.toISOString() : null,
                        })
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <div>
                  {editedTask.dueDate ? (
                    format(new Date(editedTask.dueDate), "MMMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1 opacity-70" />
                Status
              </div>
              {isEditing ? (
                <Select
                  value={editedTask.status}
                  onValueChange={(value) =>
                    setEditedTask({
                      ...editedTask,
                      status: value as TaskStatus,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      editedTask.status === "todo" && "bg-slate-500",
                      editedTask.status === "in-progress" && "bg-blue-500",
                      editedTask.status === "review" && "bg-amber-500",
                      editedTask.status === "done" && "bg-green-500"
                    )}
                  />
                  <span>
                    {editedTask.status
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium flex items-center">
                <Flag className="h-4 w-4 mr-1 opacity-70" />
                Priority
              </div>
              {isEditing ? (
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) =>
                    setEditedTask({
                      ...editedTask,
                      priority: value as Priority,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span>{editedTask.priority.charAt(0).toUpperCase() + editedTask.priority.slice(1)}</span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Description</div>
            {isEditing ? (
              <Textarea
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    description: e.target.value,
                  })
                }
                className="min-h-[120px]"
                placeholder="Enter a description..."
              />
            ) : (
              <div className="prose prose-sm max-w-none">
                {editedTask.description || (
                  <span className="text-muted-foreground italic">No description</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t p-4 bg-white sticky bottom-0 flex justify-between items-center">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setEditedTask(task); // Reset to original task
            }}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button variant="destructive" onClick={() => onDelete(task.id)}>
                Delete
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => onDelete(task.id)}>
              Delete Task
            </Button>
            <Button onClick={handleSave}>Edit Task</Button>
          </>
        )}
      </div>
    </div>
  );
}
