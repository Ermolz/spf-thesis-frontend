import { Link } from 'react-router-dom';
import { Header } from '@widgets/header';
import { RegisterForm } from '@features/auth/register';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';

export const RegisterPage = () => {
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <CardTitle className="text-3xl">Sign Up</CardTitle>
                <p className="text-text-muted text-sm mt-2">Create your account to get started</p>
              </div>
            </CardHeader>
            <CardContent>
              <RegisterForm />
              <div className="mt-6 pt-6 border-t border-border-subtle text-center">
                <p className="text-sm text-text-muted">
                  Already have an account?{' '}
                  <Link
                    to="/auth/login"
                    className="text-primary hover:text-primary-soft font-semibold transition-colors duration-200"
                  >
                    Sign In
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

