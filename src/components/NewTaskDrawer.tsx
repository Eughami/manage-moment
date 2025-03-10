
import { useState, useRef } from "react";
import { TaskStatus } from "@/services/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewTaskDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: "low" | "medium" | "high";
    dueDate: string | null;
  }) => void;
  isLoading: boolean;
}

export function NewTaskDrawer({
  isOpen,
  onOpenChange,
  onCreateTask,
  isLoading,
}: NewTaskDrawerProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as "low" | "medium" | "high",
    dueDate: null as string | null
  });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateTask = () => {
    onCreateTask(newTask);
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

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md" side="right">
        <div className="flex flex-col h-full">
          <SheetHeader className="pb-4">
            <SheetTitle>Create New Task</SheetTitle>
          </SheetHeader>
          
          <div className="grid gap-6 py-4 flex-1">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className="text-lg font-medium"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="due-date">Due Date</Label>
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
                        setNewTask({ 
                          ...newTask, 
                          dueDate: newDate ? format(newDate, "yyyy-MM-dd") : null 
                        });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
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
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <div
                className="border rounded-lg p-4 min-h-[200px]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
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
          
          <div className="flex justify-end space-x-2 pt-4 border-t mt-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
