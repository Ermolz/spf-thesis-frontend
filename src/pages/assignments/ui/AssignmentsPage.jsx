import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { Loading } from '@shared/ui/Loading';
import { Modal } from '@shared/ui/Modal';
import { assignmentApi } from '@entities/assignment/api/assignmentApi';
import { taskApi } from '@entities/task/api/taskApi';
import { paymentApi } from '@entities/payment/api/paymentApi';
import { fileApi } from '@entities/user/api/userApi';
import { formatDate, formatCurrency } from '@shared/lib/utils';
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
  const [expandedAssignments, setExpandedAssignments] = useState(new Set());
  const [tasksByAssignment, setTasksByAssignment] = useState({});
  const [paymentsByAssignment, setPaymentsByAssignment] = useState({});
  const [loadingTasks, setLoadingTasks] = useState(new Set());
  const [loadingPayments, setLoadingPayments] = useState(new Set());

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

  const toggleAssignment = async (assignmentId) => {
    const newExpanded = new Set(expandedAssignments);
    if (newExpanded.has(assignmentId)) {
      newExpanded.delete(assignmentId);
    } else {
      newExpanded.add(assignmentId);
      // Load tasks and payments if not already loaded
      if (!tasksByAssignment[assignmentId]) {
        loadTasks(assignmentId);
      }
      if (!paymentsByAssignment[assignmentId]) {
        loadPayments(assignmentId);
      }
    }
    setExpandedAssignments(newExpanded);
  };

  const loadTasks = async (assignmentId) => {
    try {
      setLoadingTasks(new Set([...loadingTasks, assignmentId]));
      const params = { page: 0, size: 20 };
      const response = await taskApi.getByAssignment(assignmentId, params);
      const tasksData = response?.content || response || [];
      setTasksByAssignment(prev => ({
        ...prev,
        [assignmentId]: Array.isArray(tasksData) ? tasksData : []
      }));
    } catch (err) {
      toast.error('Error loading tasks');
      setTasksByAssignment(prev => ({
        ...prev,
        [assignmentId]: []
      }));
    } finally {
      setLoadingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(assignmentId);
        return newSet;
      });
    }
  };

  const loadPayments = async (assignmentId) => {
    try {
      setLoadingPayments(new Set([...loadingPayments, assignmentId]));
      const params = { page: 0, size: 20 };
      const response = await paymentApi.getByAssignment(assignmentId, params);
      const paymentsData = response?.content || response || [];
      setPaymentsByAssignment(prev => ({
        ...prev,
        [assignmentId]: Array.isArray(paymentsData) ? paymentsData : []
      }));
    } catch (err) {
      toast.error('Error loading payments');
      setPaymentsByAssignment(prev => ({
        ...prev,
        [assignmentId]: []
      }));
    } finally {
      setLoadingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(assignmentId);
        return newSet;
      });
    }
  };

  const handleDownloadAttachment = async (attachmentId, fileName) => {
    try {
      const blob = await fileApi.downloadAttachment(attachmentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'attachment';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File downloaded');
    } catch (err) {
      toast.error('Error downloading file');
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
                        assignment.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        assignment.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAssignment(assignment.id)}
                        className="flex-1"
                      >
                        {expandedAssignments.has(assignment.id) ? 'Hide Details' : 'Show Details'}
                      </Button>
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
                    {expandedAssignments.has(assignment.id) && (
                      <div className="mt-4 pt-4 border-t border-border-subtle space-y-4">
                        {/* Tasks Section */}
                        <div>
                          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                            Tasks
                          </h3>
                          {loadingTasks.has(assignment.id) ? (
                            <p className="text-sm text-text-soft">Loading tasks...</p>
                          ) : tasksByAssignment[assignment.id]?.length > 0 ? (
                            <div className="space-y-2">
                              {tasksByAssignment[assignment.id].map((task) => (
                                <div key={task.id} className="p-3 rounded-lg bg-bg-elevated border border-border-subtle">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-text-main">{task.title}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      task.status === 'COMPLETED' ? 'bg-success-subtle text-success' :
                                      task.status === 'IN_PROGRESS' ? 'bg-primary-subtle text-primary' :
                                      'bg-text-soft text-text-muted'
                                    }`}>
                                      {task.status}
                                    </span>
                                  </div>
                                  {task.description && (
                                    <p className="text-xs text-text-muted mb-2">{task.description}</p>
                                  )}
                                  {task.attachments && task.attachments.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs font-semibold text-text-muted mb-1">Attachments:</p>
                                      <div className="space-y-1">
                                        {task.attachments.map((attachment) => (
                                          <button
                                            key={attachment.id}
                                            onClick={() => handleDownloadAttachment(attachment.id, attachment.fileName)}
                                            className="flex items-center gap-1 text-xs text-primary hover:text-primary-soft transition-colors"
                                          >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            {attachment.fileName}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-text-soft">No tasks yet</p>
                          )}
                        </div>

                        {/* Payments Section */}
                        <div>
                          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                            Payments
                          </h3>
                          {loadingPayments.has(assignment.id) ? (
                            <p className="text-sm text-text-soft">Loading payments...</p>
                          ) : paymentsByAssignment[assignment.id]?.length > 0 ? (
                            <div className="space-y-2">
                              {paymentsByAssignment[assignment.id].map((payment) => (
                                <div key={payment.id} className="p-3 rounded-lg bg-bg-elevated border border-border-subtle">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-text-main">
                                      {formatCurrency(payment.amount)} {payment.currency}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      payment.status === 'COMPLETED' ? 'bg-success-subtle text-success' :
                                      payment.status === 'PROCESSING' ? 'bg-primary-subtle text-primary' :
                                      'bg-text-soft text-text-muted'
                                    }`}>
                                      {payment.status}
                                    </span>
                                  </div>
                                  {payment.type && (
                                    <p className="text-xs text-text-muted">Type: {payment.type}</p>
                                  )}
                                  {payment.createdAt && (
                                    <p className="text-xs text-text-soft mt-1">{formatDate(payment.createdAt)}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-text-soft">No payments yet</p>
                          )}
                        </div>
                      </div>
                    )}
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

