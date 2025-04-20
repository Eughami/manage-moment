import { Project, ProjectStatus, ProjectType } from '@/services/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  // Status colors
  const getStatusColor = (statut: ProjectStatus) => {
    switch (statut) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'on-hold':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Type colors
  const getTypeColor = (type: ProjectType) => {
    switch (type) {
      case 'development':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'design':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 'marketing':
        return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
      case 'research':
        return 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden transition-all-200 hover:shadow-md border border-border/50 hover:border-border/80">
      <Link to={`/project/${project.id}`} className="block h-full">
        <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1 mb-1 text-lg">
              {project.nom}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-2 opacity-70 hover:opacity-100"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(project);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(project);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge
              className={cn('cursor-default', getStatusColor(project.status))}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            <Badge
              className={cn(
                'cursor-default',
                getTypeColor(project.type_projet)
              )}
            >
              {project.type_projet.charAt(0).toUpperCase() +
                project.type_projet.slice(1)}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between w-full">
            <div>{project?.tasks?.length || 0} tasks</div>
            <div>
              Updated {format(new Date(project.updated_at), 'MMM d, yyyy')}
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
