
import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, File } from "@/services/api";
import { UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onFileUpload: (file: Omit<File, "id" | "projectId" | "uploadedAt">) => void;
  currentUser: User;
}

export function FileUploadDialog({
  open,
  setOpen,
  onFileUpload,
  currentUser,
}: FileUploadDialogProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    // In a real app, we would upload these to a server
    // For this MVP, we'll create mock files
    Array.from(fileList).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const mockFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: "#",
        thumbnailUrl: isImage ? URL.createObjectURL(file) : "/placeholder.svg",
        uploadedBy: currentUser,
      };
      
      onFileUpload(mockFile);
    });
    
    setOpen(false);
    toast.success("Files uploaded successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to browse
          </DialogDescription>
        </DialogHeader>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center transition-all",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          )}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={handleFileDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground">
                Drag and drop files here or click to browse
              </p>
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm text-primary hover:underline">
                  Browse files
                </span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
