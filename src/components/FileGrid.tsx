
import { useState } from "react";
import { File, User } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Download, File as FileIcon, Image, Trash2, UploadCloud } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileGridProps {
  files: File[];
  onFileDelete: (fileId: string) => void;
  onFileUpload: (file: Omit<File, "id" | "projectId" | "uploadedAt">) => void;
  currentUser: User;
}

export function FileGrid({
  files,
  onFileDelete,
  onFileUpload,
  currentUser,
}: FileGridProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
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
    
    setUploadDialogOpen(false);
    toast.success("Files uploaded successfully");
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      onFileDelete(fileToDelete.id);
      setFileToDelete(null);
      setDeleteDialogOpen(false);
      toast.success("File deleted successfully");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-10 w-10 text-blue-500" />;
    }
    return <FileIcon className="h-10 w-10 text-amber-500" />;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm border rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Files</h2>
          <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>

        <div className="p-4">
          {files.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No files uploaded yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload your first file
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file) => (
                <Card key={file.id} className="overflow-hidden group">
                  <div className="aspect-[3/2] relative bg-muted">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.thumbnailUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="mx-1"
                        onClick={() => {
                          // In a real app, this would download the file
                          toast.info("Downloading file...");
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="mx-1"
                        onClick={() => {
                          setFileToDelete(file);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-base truncate">{file.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {formatFileSize(file.size)}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-3 pt-1 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={file.uploadedBy.avatar} alt={file.uploadedBy.name} />
                        <AvatarFallback>{getInitials(file.uploadedBy.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{format(new Date(file.uploadedAt), "MMM d")}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{fileToDelete?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
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
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
