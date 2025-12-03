import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@entities/user/model/store';
import { Button } from '@shared/ui/Button';
import { ROLES } from '@shared/config/constants';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    setIsMobileMenuOpen(false);
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

          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <span className="text-xs text-text-muted truncate max-w-[100px]">
                {user?.email}
              </span>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-muted hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-subtle py-4">
            <nav className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/projects"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-text-muted hover:text-primary transition-colors text-sm font-medium py-2"
                  >
                    Projects
                  </Link>
                  {user?.role === ROLES.CLIENT && (
                    <Link
                      to="/projects/create"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-text-muted hover:text-primary transition-colors text-sm font-medium py-2"
                    >
                      Create Project
                    </Link>
                  )}
                  {user?.role === ROLES.FREELANCER && (
                    <Link
                      to="/proposals"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-text-muted hover:text-primary transition-colors text-sm font-medium py-2"
                    >
                      My Proposals
                    </Link>
                  )}
                  <Link
                    to="/assignments"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-text-muted hover:text-primary transition-colors text-sm font-medium py-2"
                  >
                    Assignments
                  </Link>
                  <Link
                    to="/chat"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-text-muted hover:text-primary transition-colors text-sm font-medium py-2"
                  >
                    Chat
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-text-muted hover:text-primary transition-colors text-sm font-medium py-2"
                  >
                    Profile
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-start">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

