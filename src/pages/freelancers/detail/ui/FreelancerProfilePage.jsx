import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { Loading } from '@shared/ui/Loading';
import { profileApi } from '@entities/user/api/userApi';
import { formatCurrency, formatDate } from '@shared/lib/utils';
import { toast } from '@shared/lib/toast';

export const FreelancerProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileApi.getFreelancerById(Number(userId));
      setProfile(data);
    } catch (err) {
      toast.error('Error loading freelancer profile');
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Header />
      <div className="bg-bg-body">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="mb-8 group"
          >
            <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </span>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 fade-in">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl leading-tight">
                    {profile.displayName || profile.email}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.bio && (
                      <div>
                        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                          About
                        </h3>
                        <p className="text-text-muted whitespace-pre-wrap leading-relaxed">
                          {profile.bio}
                        </p>
                      </div>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-3 py-1.5 bg-primary-subtle text-primary rounded-full text-sm font-medium border border-primary/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border-subtle">
                      {profile.hourlyRate && (
                        <div className="p-4 rounded-xl bg-primary-subtle/30 border border-primary/10">
                          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                            Hourly Rate
                          </h3>
                          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {formatCurrency(profile.hourlyRate)}
                            {profile.currency && ` ${profile.currency}`}/hr
                          </p>
                        </div>
                      )}

                      {profile.rating !== null && profile.rating !== undefined && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                            Rating
                          </h3>
                          <p className="text-2xl sm:text-3xl font-bold text-text-main">
                            {profile.rating.toFixed(1)} ⭐
                          </p>
                        </div>
                      )}

                      {profile.completedProjectsCount !== null && profile.completedProjectsCount !== undefined && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                            Completed Projects
                          </h3>
                          <p className="text-2xl sm:text-3xl font-bold text-text-main">
                            {profile.completedProjectsCount}
                          </p>
                        </div>
                      )}
                    </div>

                    {profile.createdAt && (
                      <div className="pt-4 border-t border-border-subtle">
                        <p className="text-sm text-text-soft font-medium">
                          Member since: {formatDate(profile.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

