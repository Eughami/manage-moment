
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectOverviewProps {
  projectId?: string;
}

const ProjectOverview = ({ projectId }: ProjectOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-semibold">In Progress</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-semibold">12</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Due Date</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-semibold">Mar 15, 2024</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
