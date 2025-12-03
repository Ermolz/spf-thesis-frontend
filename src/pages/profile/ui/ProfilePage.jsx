import { useState, useEffect, useRef } from 'react';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Loading } from '@shared/ui/Loading';
import { Modal } from '@shared/ui/Modal';
import { Button } from '@shared/ui/Button';
import { useAuthStore } from '@entities/user/model/store';
import { profileApi, fileApi } from '@entities/user/api/userApi';
import { ROLES } from '@shared/config/constants';
import { toast } from '@shared/lib/toast';
import { formatDate } from '@shared/lib/utils';
import { UpdateFreelancerProfileForm } from '@features/profile/update-freelancer-profile';
import { UpdateClientProfileForm } from '@features/profile/update-client-profile';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false);
  const fileInputRef = useRef(null);

  const loadProfile = async (userToLoad = user) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      let data;
      if (userToLoad?.role === ROLES.FREELANCER) {
        data = await profileApi.getFreelancerProfile();
      } else if (userToLoad?.role === ROLES.CLIENT) {
        data = await profileApi.getClientProfile();
      } else {
        setLoadError('Unknown user role');
        setIsLoading(false);
        return;
      }
      setProfile(data);
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error loading profile';
      setLoadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoading(false);
      setLoadError('User is not authorized');
      return;
    }

    if (user && isAuthenticated && user.role) {
      loadProfile(user);
    } else if (token) {
      const timer = setTimeout(() => {
        const currentUser = useAuthStore.getState().user;
        const currentAuth = useAuthStore.getState().isAuthenticated;
        if (currentUser && currentAuth && currentUser.role) {
          loadProfile(currentUser);
        } else {
          setIsLoading(false);
          setLoadError('Error loading user data. Please try logging in again.');
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setLoadError('User is not authorized');
    }
  }, [user, isAuthenticated]);

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (loadError || !user || !isAuthenticated) {
    return (
      <>
        <Header />
        <div className="bg-bg-body flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <p className="text-text-muted text-lg">{loadError || 'User is not authorized.'}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-bg-body">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8 fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-main mb-2 tracking-tight">
              Profile
            </h1>
            <p className="text-text-muted text-sm sm:text-base">
              Manage your account information and preferences
            </p>
          </div>

          <div className="max-w-3xl fade-in">
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-2xl">User Information</CardTitle>
                      <p className="text-text-soft text-sm mt-1">{user?.role || 'User'}</p>
                    </div>
                  </div>
                  <Button onClick={() => setIsEditModalOpen(true)} variant="secondary">
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                      Email
                    </label>
                    <p className="text-text-main font-medium">{profile?.email || user?.email || 'Not specified'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                      Role
                    </label>
                    <p className="text-text-main font-medium">{user?.role || 'Not specified'}</p>
                  </div>

                  {user?.role === ROLES.FREELANCER && profile && (
                    <>
                      {profile.displayName && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                            Display Name
                          </label>
                          <p className="text-text-main font-medium">{profile.displayName}</p>
                        </div>
                      )}
                      {profile.bio && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                            Bio
                          </label>
                          <p className="text-text-main leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                        </div>
                      )}
                      {profile.skills && profile.skills.length > 0 && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-3">
                            Skills
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-primary-subtle text-primary rounded-full text-sm font-medium border border-primary/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {profile.hourlyRate && (
                        <div className="p-4 rounded-xl bg-primary-subtle/30 border border-primary/10">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                            Hourly Rate
                          </label>
                          <p className="text-xl font-bold text-primary">
                            {profile.hourlyRate} {profile.currency || 'USD'}
                          </p>
                        </div>
                      )}
                      {profile.rating !== null && profile.rating !== undefined && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                            Rating
                          </label>
                          <div className="flex items-center gap-3">
                            <p className="text-2xl font-bold text-text-main">
                              {profile.rating.toFixed(1)}
                            </p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < Math.round(profile.rating)
                                      ? 'text-warning'
                                      : 'text-text-soft'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {profile.completedProjectsCount !== null && profile.completedProjectsCount !== undefined && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                            Completed Projects
                          </label>
                          <p className="text-2xl font-bold text-primary">{profile.completedProjectsCount}</p>
                        </div>
                      )}
                      <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                          Portfolio
                        </label>
                        {profile.portfolioFilePath ? (
                          <div className="flex items-center gap-3">
                            <a
                              href={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/files/portfolios/${profile.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-soft transition-colors flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              View Portfolio PDF
                            </a>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              isLoading={isUploadingPortfolio}
                            >
                              Replace
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-text-soft mb-2">No portfolio uploaded yet</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              isLoading={isUploadingPortfolio}
                            >
                              Upload Portfolio (PDF)
                            </Button>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            if (file.type !== 'application/pdf') {
                              toast.error('Only PDF files are allowed');
                              return;
                            }
                            
                            if (file.size > 10 * 1024 * 1024) {
                              toast.error('File size exceeds 10MB limit');
                              return;
                            }
                            
                            try {
                              setIsUploadingPortfolio(true);
                              await profileApi.uploadPortfolio(file);
                              toast.success('Portfolio uploaded successfully');
                              loadProfile();
                            } catch (err) {
                              const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error uploading portfolio';
                              toast.error(errorMessage);
                            } finally {
                              setIsUploadingPortfolio(false);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </>
                  )}

                  {user?.role === ROLES.CLIENT && profile && (
                    <>
                      {profile.companyName && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                            Company Name
                          </label>
                          <p className="text-text-main font-medium">{profile.companyName}</p>
                        </div>
                      )}
                      {profile.bio && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                            Company Description
                          </label>
                          <p className="text-text-main leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                        </div>
                      )}
                      {profile.totalSpent !== null && profile.totalSpent !== undefined && (
                        <div className="p-4 rounded-xl bg-primary-subtle/30 border border-primary/10">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                            Total Spent
                          </label>
                          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            ${profile.totalSpent.toFixed(2)}
                          </p>
                        </div>
                      )}
                      {profile.rating !== null && profile.rating !== undefined && (
                        <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                            Rating
                          </label>
                          <div className="flex items-center gap-3">
                            <p className="text-2xl font-bold text-text-main">
                              {profile.rating.toFixed(1)}
                            </p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < Math.round(profile.rating)
                                      ? 'text-warning'
                                      : 'text-text-soft'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {profile?.createdAt && (
                    <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block mb-2">
                        Profile Created At
                      </label>
                      <p className="text-text-main font-medium">{formatDate(profile.createdAt)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Edit Profile"
            size="lg"
          >
            {user?.role === ROLES.FREELANCER ? (
              <UpdateFreelancerProfileForm
                profile={profile}
                onSuccess={() => {
                  setIsEditModalOpen(false);
                  loadProfile();
                }}
              />
            ) : user?.role === ROLES.CLIENT ? (
              <UpdateClientProfileForm
                profile={profile}
                onSuccess={() => {
                  setIsEditModalOpen(false);
                  loadProfile();
                }}
              />
            ) : null}
          </Modal>
        </div>
      </div>
    </>
  );
};

