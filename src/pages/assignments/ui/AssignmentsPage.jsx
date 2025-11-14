import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { Loading } from '@shared/ui/Loading';
import { Modal } from '@shared/ui/Modal';
import { assignmentApi } from '@entities/assignment/api/assignmentApi';
import { formatDate } from '@shared/lib/utils';
import { toast } from '@shared/lib/toast';
import { useAuthStore } from '@entities/user/model/store';
import { ROLES } from '@shared/config/constants';

export const AssignmentsPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const params = { page: 0, size: 20 };
      const response =
        user?.role === ROLES.CLIENT
          ? await assignmentApi.getClient(params)
          : await assignmentApi.getMy(params);
      const assignmentsData = response?.content || response || [];
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
    } catch (err) {
      toast.error('Error loading assignments');
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedAssignmentId) return;
    try {
      setIsLoadingAction(true);
      await assignmentApi.complete(selectedAssignmentId);
      toast.success('Assignment completed');
      setIsCompleteModalOpen(false);
      setSelectedAssignmentId(null);
      loadAssignments();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error completing assignment';
      toast.error(errorMessage);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedAssignmentId) return;
    try {
      setIsLoadingAction(true);
      await assignmentApi.cancel(selectedAssignmentId);
      toast.success('Assignment cancelled');
      setIsCancelModalOpen(false);
      setSelectedAssignmentId(null);
      loadAssignments();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error cancelling assignment';
      toast.error(errorMessage);
    } finally {
      setIsLoadingAction(false);
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

  return (
    <>
      <Header />
      <div className="bg-bg-body">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-6">
            My Assignments
          </h1>

          {!assignments || assignments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-text-muted text-lg">
                  You don't have any assignments yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(assignments) && assignments.map((assignment) => (
                <Card key={assignment.id} variant="elevated">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <CardTitle className="text-lg sm:text-xl">
                        {assignment.projectTitle || `Assignment #${assignment.id}`}
                      </CardTitle>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        assignment.status === 'ACTIVE' ? 'bg-success-soft text-success' :
                        assignment.status === 'COMPLETED' ? 'bg-accent-soft text-accent' :
                        'bg-red-900 text-red-400'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {assignment.projectId && (
                        <div>
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                            Project ID
                          </p>
                          <p className="text-sm text-text-main">{assignment.projectId}</p>
                        </div>
                      )}
                      {assignment.freelancerDisplayName && (
                        <div>
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                            Freelancer
                          </p>
                          <p className="text-sm text-text-main">{assignment.freelancerDisplayName}</p>
                        </div>
                      )}
                      {assignment.createdAt && (
                        <div>
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                            Created
                          </p>
                          <p className="text-sm text-text-soft">{formatDate(assignment.createdAt)}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border-subtle">
                      <Link to={`/tasks?assignmentId=${assignment.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Tasks
                        </Button>
                      </Link>
                      {assignment.status === 'ACTIVE' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedAssignmentId(assignment.id);
                              setIsCompleteModalOpen(true);
                            }}
                          >
                            Complete
                          </Button>
                          {user?.role === ROLES.CLIENT && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setSelectedAssignmentId(assignment.id);
                                setIsCancelModalOpen(true);
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setSelectedAssignmentId(null);
        }}
        title="Complete Assignment"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCompleteModalOpen(false);
                setSelectedAssignmentId(null);
              }}
              disabled={isLoadingAction}
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              isLoading={isLoadingAction}
            >
              Complete
            </Button>
          </>
        }
      >
        <p className="text-text-muted">
          Are you sure you want to mark this assignment as completed?
        </p>
      </Modal>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedAssignmentId(null);
        }}
        title="Cancel Assignment"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCancelModalOpen(false);
                setSelectedAssignmentId(null);
              }}
              disabled={isLoadingAction}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              isLoading={isLoadingAction}
            >
              Cancel Assignment
            </Button>
          </>
        }
      >
        <p className="text-text-muted">
          Are you sure you want to cancel this assignment? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

