import { Link } from 'react-router-dom';
import { useAuthStore } from '@entities/user/model/store';
import { Header } from '@widgets/header';
import { Button } from '@shared/ui/Button';
import { Card, CardContent } from '@shared/ui/Card';
import { ROLES } from '@shared/config/constants';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <>
      <Header />
      <div className="bg-bg-body">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-16 sm:mb-20 fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main mb-6 tracking-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                Freelance Platform
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
              Connect talented freelancers with exciting projects. Build your career or find the perfect team.
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="max-w-md mx-auto fade-in">
              <Card variant="elevated">
                <CardContent className="text-center space-y-6 p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-2">
                    <svg className="w-8 h-8 text-text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-text-main">
                    Get Started
                  </h2>
                  <p className="text-text-muted leading-relaxed">
                    Sign in or register to start your journey
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link to="/auth/login" className="flex-1">
                      <Button className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/auth/register" className="flex-1">
                      <Button className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <Card variant="elevated" className="group fade-in">
                <CardContent className="p-6 sm:p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-subtle mb-4 group-hover:bg-primary transition-colors duration-200">
                    <svg className="w-6 h-6 text-primary group-hover:text-text-on-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-main mb-3">
                    Projects
                  </h3>
                  <p className="text-text-muted mb-6 leading-relaxed">
                    {user?.role === ROLES.CLIENT
                      ? 'Create and manage projects'
                      : 'Find the right project'}
                  </p>
                  <Link to="/projects">
                    <Button className="w-full">Go to Projects</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card variant="elevated" className="group fade-in" style={{ animationDelay: '100ms' }}>
                <CardContent className="p-6 sm:p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-subtle mb-4 group-hover:bg-primary transition-colors duration-200">
                    <svg className="w-6 h-6 text-primary group-hover:text-text-on-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-main mb-3">
                    Assignments
                  </h3>
                  <p className="text-text-muted mb-6 leading-relaxed">
                    Manage your assignments and tasks
                  </p>
                  <Link to="/assignments">
                    <Button className="w-full">My Assignments</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card variant="elevated" className="group fade-in" style={{ animationDelay: '200ms' }}>
                <CardContent className="p-6 sm:p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-subtle mb-4 group-hover:bg-primary transition-colors duration-200">
                    <svg className="w-6 h-6 text-primary group-hover:text-text-on-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-main mb-3">
                    Chat
                  </h3>
                  <p className="text-text-muted mb-6 leading-relaxed">
                    Communicate with clients and freelancers
                  </p>
                  <Link to="/chat">
                    <Button className="w-full">Open Chat</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

