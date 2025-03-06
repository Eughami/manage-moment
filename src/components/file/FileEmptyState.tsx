
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";

interface FileEmptyStateProps {
  onUploadClick: () => void;
}

export function FileEmptyState({ onUploadClick }: FileEmptyStateProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <FileIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
      <p>No files uploaded yet</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={onUploadClick}
      >
        Upload your first file
      </Button>
    </div>
  );
}
