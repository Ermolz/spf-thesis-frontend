import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@entities/user/model/store';
import { Button } from '@shared/ui/Button';
import { ROLES } from '@shared/config/constants';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <header className="bg-bg-elevated/80 backdrop-blur-xl shadow-lg border-b border-border-subtle sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
              Freelance
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/projects"
                  className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
                >
                  Projects
                </Link>
                {user?.role === ROLES.CLIENT && (
                  <Link
                    to="/projects/create"
                    className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
                  >
                    Create Project
                  </Link>
                )}
                {user?.role === ROLES.FREELANCER && (
                  <Link
                    to="/proposals"
                    className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
                  >
                    My Proposals
                  </Link>
                )}
                <Link
                  to="/assignments"
                  className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
                >
                  Assignments
                </Link>
                <Link
                  to="/chat"
                  className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
                >
                  Chat
                </Link>
                <Link
                  to="/profile"
                  className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-text-muted">
                    {user?.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          <div className="md:hidden">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-text-muted truncate max-w-[100px]">
                  {user?.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

