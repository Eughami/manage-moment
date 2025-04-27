import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskList } from '@/components/TaskList';
import { FileGrid } from '@/components/FileGrid';
import ProjectOverview from '@/components/ProjectOverview';
import { Task, TaskStatus, File, User, Project } from '@/services/api';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface ProjectTabsProps {
  project: Project;
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="finances">finances</TabsTrigger>
        <TabsTrigger value="techniques">techniques</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <ProjectOverview project={project} />
      </TabsContent>
      <TabsContent value="finances">
        <div className="bg-white/60 backdrop-blur-md rounded-xl border p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Pas d'operations financière
          </h3>
          <p className="text-muted-foreground mb-6">
            Créez votre première opération financière pour commencer.
          </p>
          <Button onClick={() => console.log('Trigger create modal')}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter opération
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="techniques">
        <div className="bg-white/60 backdrop-blur-md rounded-xl border p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Pas d'operations technique
          </h3>
          <p className="text-muted-foreground mb-6">
            Créez votre première opération technique pour commencer.
          </p>
          <Button onClick={() => console.log('Trigger create modal')}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter opération
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
