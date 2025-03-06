
import { useState } from "react";
import { File, User } from "@/services/api";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { FileCard } from "./file/FileCard";
import { FileDeleteDialog } from "./file/FileDeleteDialog";
import { FileUploadDialog } from "./file/FileUploadDialog";
import { FileEmptyState } from "./file/FileEmptyState";

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

  const handleDeleteClick = (file: File) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      onFileDelete(fileToDelete.id);
      setFileToDelete(null);
      setDeleteDialogOpen(false);
      toast.success("File deleted successfully");
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
            <FileEmptyState onUploadClick={() => setUploadDialogOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file) => (
                <FileCard 
                  key={file.id} 
                  file={file} 
                  onDeleteClick={handleDeleteClick} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <FileDeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        file={fileToDelete}
        onConfirm={confirmDelete}
      />

      {/* Upload Dialog */}
      <FileUploadDialog
        open={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
        onFileUpload={onFileUpload}
        currentUser={currentUser}
      />
    </>
  );
}
