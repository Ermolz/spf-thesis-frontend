import { useState, useEffect } from 'react';
import { Header } from '@widgets/header';
import { ProjectCard } from '@widgets/project-card';
import { ProjectSearch } from '@features/project/search-projects';
import { projectApi } from '@entities/project/api/projectApi';
import { Loading } from '@shared/ui/Loading';
import { toast } from '@shared/lib/toast';

export const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: null,
    categoryId: null,
    minBudget: null,
    maxBudget: null,
    tagIds: [],
    minDeadline: null,
    maxDeadline: null,
  });

  const loadProjects = async (currentFilters) => {
    try {
      setIsLoading(true);
      const params = {
        page: 0,
        size: 20,
      };
      
      if (currentFilters.status) {
        params.status = currentFilters.status;
      }
      if (currentFilters.categoryId) {
        params.categoryId = currentFilters.categoryId;
      }
      if (currentFilters.minBudget !== null && currentFilters.minBudget !== undefined && currentFilters.minBudget !== '') {
        params.minBudget = Number(currentFilters.minBudget);
      }
      if (currentFilters.maxBudget !== null && currentFilters.maxBudget !== undefined && currentFilters.maxBudget !== '') {
        params.maxBudget = Number(currentFilters.maxBudget);
      }
      if (currentFilters.tagIds && Array.isArray(currentFilters.tagIds) && currentFilters.tagIds.length > 0) {
        params.tagIds = currentFilters.tagIds;
      }
      if (currentFilters.minDeadline) {
        params.minDeadline = currentFilters.minDeadline;
      }
      if (currentFilters.maxDeadline) {
        params.maxDeadline = currentFilters.maxDeadline;
      }
      
      const response = await projectApi.search(params);
      
      let projectsData = [];
      if (response) {
        if (response.content && Array.isArray(response.content)) {
          projectsData = response.content;
        } else if (Array.isArray(response)) {
          projectsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          projectsData = response.data;
        }
      }
      
      setProjects(projectsData);
    } catch (err) {
      console.error('Error loading projects:', err);
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error loading projects';
      toast.error(errorMessage);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(filters);
  }, [filters.status, filters.categoryId, filters.minBudget, filters.maxBudget, filters.tagIds?.length, filters.minDeadline, filters.maxDeadline]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-bg-body">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8 sm:mb-10 fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main mb-2 tracking-tight">
              Projects
            </h1>
            <p className="text-text-muted text-sm sm:text-base mb-6">
              Discover and explore available projects
            </p>
            <ProjectSearch onSearch={handleSearch} filters={filters} />
          </div>

          {!projects || projects.length === 0 ? (
            <div className="text-center py-16 sm:py-20 fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-subtle mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-text-muted text-lg font-medium">No projects found</p>
              <p className="text-text-soft text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.isArray(projects) && projects.map((project, index) => (
                <div key={project.id} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

