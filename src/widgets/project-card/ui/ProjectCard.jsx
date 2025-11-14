import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { formatCurrency, formatDate } from '@shared/lib/utils';

export const ProjectCard = ({ project }) => {
  const statusColors = {
    DRAFT: 'bg-primary-subtle text-text-muted',
    OPEN: 'badge-open bg-success-soft text-success',
    IN_PROGRESS: 'bg-primary-soft text-primary',
    COMPLETED: 'bg-accent-soft text-accent',
    CANCELLED: 'bg-red-900 text-red-400',
  };

  const statusLabels = {
    DRAFT: 'Draft',
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  return (
    <Link to={`/projects/${project.id}`} className="block h-full">
      <Card className="h-full group">
        <CardHeader>
          <div className="flex items-start justify-between gap-3 mb-3">
            <CardTitle className="line-clamp-2 flex-1 group-hover:text-primary transition-colors duration-200">
              {project.title}
            </CardTitle>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${statusColors[project.status] || statusColors.DRAFT}`}
            >
              {statusLabels[project.status] || project.status}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm sm:text-base text-text-muted line-clamp-3 mb-5 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border-subtle">
            <div className="flex flex-col">
              {project.budgetMin && project.budgetMax ? (
                <span className="text-xl sm:text-2xl font-bold text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
                  {project.currency && ` ${project.currency}`}
                </span>
              ) : (
                <span className="text-xl sm:text-2xl font-bold text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatCurrency(project.budget || project.budgetMin || 0)}
                  {project.currency && ` ${project.currency}`}
                </span>
              )}
            </div>
            {project.createdAt && (
              <span className="text-xs text-text-soft font-medium">
                {formatDate(project.createdAt)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

