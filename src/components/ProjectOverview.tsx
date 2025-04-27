import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { humanDate } from '@/lib/utils';
import { Project } from '@/services/api';

interface ProjectOverviewProps {
  project: Project;
}

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-semibold">{project.status}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-semibold">{project.budget}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Due Date</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-semibold">
            {humanDate(project.date_fin)}
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
