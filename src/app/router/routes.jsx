import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { HomePage } from '@pages/home/ui/HomePage';
import { LoginPage } from '@pages/auth/login/ui/LoginPage';
import { RegisterPage } from '@pages/auth/register/ui/RegisterPage';
import { ProjectsListPage } from '@pages/projects/list/ui/ProjectsListPage';
import { ProjectDetailPage } from '@pages/projects/detail/ui/ProjectDetailPage';
import { CreateProjectPage } from '@pages/projects/create/ui/CreateProjectPage';
import { ProposalsPage } from '@pages/proposals/ui/ProposalsPage';
import { AssignmentsPage } from '@pages/assignments/ui/AssignmentsPage';
import { TasksPage } from '@pages/tasks/ui/TasksPage';
import { ChatPage } from '@pages/chat/ui/ChatPage';
import { ProfilePage } from '@pages/profile/ui/ProfilePage';
import { PaymentsPage } from '@pages/payments/ui/PaymentsPage';
import { ReviewsPage } from '@pages/reviews/ui/ReviewsPage';
import { ROLES } from '@shared/config/constants';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <ProjectsListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <PrivateRoute>
            <ProjectDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/projects/create"
        element={
          <PrivateRoute role={ROLES.CLIENT}>
            <CreateProjectPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/proposals"
        element={
          <PrivateRoute>
            <ProposalsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <PrivateRoute>
            <AssignmentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <TasksPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <PrivateRoute>
            <PaymentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <PrivateRoute>
            <ReviewsPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

