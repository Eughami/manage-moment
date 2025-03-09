
import { useState } from "react";
import { Task, TaskStatus, Priority, User } from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: () => void;
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskList({
  tasks,
  onTaskSelect,
  onTaskDelete,
  onAddTask,
  onTaskStatusChange,
}: TaskListProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "review":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "done":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
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
    <div className="border rounded-lg bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button size="sm" onClick={onAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No tasks found. Create your first task.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow 
                  key={task.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => onTaskSelect(task)}
                >
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? (
                      <span className="text-sm">
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No due date</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Badge
                          className={cn(
                            "cursor-pointer transition-all",
                            getStatusColor(task.status)
                          )}
                        >
                          {task.status
                            .split("-")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskStatusChange(task.id, "todo");
                          }}
                        >
                          To Do
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskStatusChange(task.id, "in-progress");
                          }}
                        >
                          In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskStatusChange(task.id, "review");
                          }}
                        >
                          Review
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskStatusChange(task.id, "done");
                          }}
                        >
                          Done
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "cursor-default",
                        getPriorityColor(task.priority)
                      )}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
