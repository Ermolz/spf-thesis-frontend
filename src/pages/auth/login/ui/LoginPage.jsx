import { Link } from 'react-router-dom';
import { Header } from '@widgets/header';
import { LoginForm } from '@features/auth/login';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';

export const LoginPage = () => {
  return (
    <>
      <Header />
      <div className="bg-bg-body flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md fade-in">
          <Card variant="elevated">
            <CardHeader>
              <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-primary mb-4">
                  <svg className="w-7 h-7 text-text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle className="text-3xl">Sign In</CardTitle>
                <p className="text-text-muted text-sm mt-2">Welcome back! Please sign in to continue</p>
              </div>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <div className="mt-6 pt-6 border-t border-border-subtle text-center">
                <p className="text-sm text-text-muted">
                  Don't have an account?{' '}
                  <Link
                    to="/auth/register"
                    className="text-primary hover:text-primary-soft font-semibold transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

