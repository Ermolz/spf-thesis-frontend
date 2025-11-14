import { Header } from '@widgets/header';
import { CreateProjectForm } from '@features/project/create-project';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';

export const CreateProjectPage = () => {
  return (
    <>
      <Header />
      <div className="bg-bg-body">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto fade-in">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-text-main mb-2 tracking-tight">
                Create Project
              </h1>
              <p className="text-text-muted text-sm sm:text-base">
                Fill in the details to create a new project
              </p>
            </div>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateProjectForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

