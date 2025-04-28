import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { humanDate } from '@/lib/utils';
import { Project } from '@/services/api';

interface ProjectOverviewProps {
  project: Project;
}

const CustomCard = ({ k, val }) => (
  <Card>
    <CardHeader>
      <CardTitle>{k}</CardTitle>
    </CardHeader>
    <CardContent>
      <span className="text-2xl font-semibold">{val}</span>
    </CardContent>
  </Card>
);

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <CustomCard k="Statut" val={project?.status} />
      <CustomCard k="Date Debut" val={humanDate(project.date_debut)} />
      <CustomCard k="Date Fin" val={humanDate(project.date_fin)} />
      <CustomCard k="Budget" val={project?.budget} />
      <CustomCard
        k="Operations Finances"
        val={project?.operations_finance?.length}
      />
      <CustomCard
        k="Depense Total"
        val={project?.operations_finance?.reduce(
          (prev, of) => prev + parseInt(of.depense, 10),
          0
        )}
      />
      <CustomCard
        k="Operations Techniques"
        val={project?.operations_technique?.length}
      />
    </div>
  );
};

export default ProjectOverview;
