import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectOverview from '@/components/ProjectOverview';
import { Project } from '@/services/api';
import Finances from '@/pages/OperationFinance';
import Techniques from '@/pages/OperationTechnique';

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
        <Finances pid={project?.id} />
      </TabsContent>
      <TabsContent value="techniques">
        <Techniques pid={project?.id} />
      </TabsContent>
    </Tabs>
  );
}
