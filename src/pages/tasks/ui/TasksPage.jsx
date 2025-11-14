import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { Loading } from '@shared/ui/Loading';
import { Modal } from '@shared/ui/Modal';
import { CreateTaskForm } from '@features/task/create-task';
import { UpdateTaskForm } from '@features/task/update-task';
import { taskApi } from '@entities/task/api/taskApi';
import { fileApi } from '@entities/user/api/userApi';
import { formatDate } from '@shared/lib/utils';
import { toast } from '@shared/lib/toast';

export const TasksPage = () => {
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('assignmentId');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      loadTasks();
    }
  }, [assignmentId]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const params = { page: 0, size: 20 };
      const response = await taskApi.getByAssignment(Number(assignmentId), params);
      const tasksData = response?.content || response || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) {
      toast.error('Error loading tasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    try {
      setIsLoadingAction(true);
      await taskApi.delete(selectedTask.id);
      toast.success('Task deleted');
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
      loadTasks();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error deleting task';
      toast.error(errorMessage);
    } finally {
      setIsLoadingAction(false);
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
              Tasks
            </h1>
            {assignmentId && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Task
              </Button>
            )}
          </div>

          {!assignmentId ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-text-muted text-lg">
                  Select an assignment to view tasks
                </p>
              </CardContent>
            </Card>
          ) : !tasks || tasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-text-muted text-lg">No tasks yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Array.isArray(tasks) && tasks.map((task) => (
                <Card key={task.id} variant="elevated">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <CardTitle className="text-lg sm:text-xl">{task.title}</CardTitle>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        task.status === 'TODO' ? 'bg-primary-subtle text-primary' :
                        task.status === 'IN_PROGRESS' ? 'bg-primary-soft text-primary' :
                        task.status === 'COMPLETED' ? 'bg-success-soft text-success' :
                        'bg-red-900 text-red-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {task.description && (
                      <p className="text-text-muted mb-4 leading-relaxed">{task.description}</p>
                    )}
                    <div className="space-y-2 mb-4">
                      {task.deadline && (
                        <div>
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                            Deadline
                          </p>
                          <p className="text-sm text-text-main">{formatDate(task.deadline)}</p>
                        </div>
                      )}
                      {task.createdAt && (
                        <div>
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                            Created
                          </p>
                          <p className="text-sm text-text-soft">{formatDate(task.createdAt)}</p>
                        </div>
                      )}
                    </div>
                    {task.attachments && task.attachments.length > 0 && (
                      <div className="mb-4 p-3 rounded-lg bg-bg-elevated border border-border-subtle">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                          Attachments
                        </p>
                        <div className="space-y-2">
                          {task.attachments.map((attachment) => (
                            <button
                              key={attachment.id}
                              onClick={() => handleDownloadAttachment(attachment.id, attachment.fileName)}
                              className="flex items-center gap-2 text-sm text-primary hover:text-primary-soft transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {attachment.fileName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border-subtle">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Task"
        size="md"
      >
        <CreateTaskForm
          assignmentId={Number(assignmentId)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            loadTasks();
          }}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        title="Edit Task"
        size="md"
      >
        {selectedTask && (
          <UpdateTaskForm
            task={selectedTask}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedTask(null);
              loadTasks();
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        title="Delete Task"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTask(null);
              }}
              disabled={isLoadingAction}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isLoadingAction}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-text-muted">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

