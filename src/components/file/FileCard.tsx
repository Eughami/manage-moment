
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
import { Download, File as FileIcon, Image, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FileCardProps {
  file: File;
  onDeleteClick: (file: File) => void;
}

export function FileCard({ file, onDeleteClick }: FileCardProps) {
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
    <Card className="overflow-hidden group">
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
            onClick={() => onDeleteClick(file)}
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
  );
}
