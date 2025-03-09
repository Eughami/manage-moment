
import { useState, useRef, useEffect } from "react";
import { Task, TaskStatus } from "@/services/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, FileUp, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedTask: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  isLoading: boolean;
}

export function TaskDrawer({
  task,
  isOpen,
  onOpenChange,
  onSave,
  onDelete,
  isLoading,
}: TaskDrawerProps) {
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [date, setDate] = useState<Date | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset form when task changes or drawer opens
  useEffect(() => {
    if (task && isOpen) {
      setEditedTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      });
      
      setDate(task.dueDate ? new Date(task.dueDate) : undefined);
    }
  }, [task, isOpen]);

  const handleSave = () => {
    onSave(editedTask);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file uploads here
    console.log("Files selected:", e.target.files);
    // In a real implementation, you would upload these files and attach them to the task
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("Files dropped:", e.dataTransfer.files);
      // In a real implementation, you would upload these files and attach them to the task
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (!task) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md flex flex-col" side="right">
        <SheetHeader className="pb-4">
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>
        
        <div className="grid gap-6 py-4 flex-grow overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={editedTask.title || task.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              placeholder="Task title"
              className="text-lg font-medium"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Assignee</Label>
            <div className="flex items-center space-x-2 py-2">
              <Avatar>
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
              </Avatar>
              <span>{task.assignee.name}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-due-date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setEditedTask({ 
                        ...editedTask, 
                        dueDate: newDate ? format(newDate, "yyyy-MM-dd") : null 
                      });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editedTask.status || task.status}
                onValueChange={(value) => setEditedTask({ ...editedTask, status: value as TaskStatus })}
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
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-priority">Priority</Label>
            <Select
              value={editedTask.priority || task.priority}
              onValueChange={(value) => setEditedTask({ ...editedTask, priority: value as "low" | "medium" | "high" })}
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
          
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <div
              className="border rounded-lg p-4 min-h-[200px]"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <textarea
                id="edit-description"
                value={editedTask.description || task.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                placeholder="Task description"
                className="w-full h-full min-h-[150px] resize-none border-none focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Attachments</Label>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center"
              >
                <FileUp className="h-4 w-4 mr-2" />
                Add files
              </Button>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-sm text-muted-foreground mt-2">
                Drag and drop files into the description area or click 'Add files'
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6 pt-4 border-t sticky bottom-0 bg-background">
          <Button 
            variant="destructive" 
            onClick={() => onDelete(task.id)}
            className="flex items-center"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
