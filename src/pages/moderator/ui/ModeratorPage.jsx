import { useState, useEffect } from 'react';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { Loading } from '@shared/ui/Loading';
import { Modal } from '@shared/ui/Modal';
import { Input } from '@shared/ui/Input';
import { moderatorApi } from '@entities/moderator/api/moderatorApi';
import { taskApi } from '@entities/task/api/taskApi';
import { toast } from '@shared/lib/toast';
import { formatDate } from '@shared/lib/utils';

export const ModeratorPage = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      if (activeTab === 'tasks') {
        setTasks([]);
      } else {
        setUsers([]);
      }
    } catch (err) {
      toast.error('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!selectedItem) return;
    try {
      setIsLoadingAction(true);
      if (activeTab === 'tasks') {
        await moderatorApi.blockTask(selectedItem.id);
        toast.success('Task blocked successfully');
      } else {
        await moderatorApi.blockUser(selectedItem.id);
        toast.success('User blocked successfully');
      }
      setIsBlockModalOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error blocking';
      toast.error(errorMessage);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleUnblock = async () => {
    if (!selectedItem) return;
    try {
      setIsLoadingAction(true);
      if (activeTab === 'tasks') {
        await moderatorApi.unblockTask(selectedItem.id);
        toast.success('Task unblocked successfully');
      } else {
        await moderatorApi.unblockUser(selectedItem.id);
        toast.success('User unblocked successfully');
      }
      setIsUnblockModalOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error unblocking';
      toast.error(errorMessage);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Moderator Panel
          </h1>

          <div className="flex gap-2 mb-6 border-b border-border-subtle">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-soft hover:text-text-main'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-soft hover:text-text-main'
              }`}
            >
              Users
            </button>
          </div>

          <div className="mb-6">
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {activeTab === 'tasks' ? (
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-text-muted">
                      No tasks found. Tasks will appear here when they are created.
                    </p>
                    <p className="text-text-soft text-sm mt-2">
                      Note: You need to implement an endpoint to fetch all tasks for moderators.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => (
                  <Card key={task.id} variant="elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{task.title}</CardTitle>
                        {task.isBlocked ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900 text-red-400">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success-soft text-success">
                            Active
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-text-soft text-sm mb-4">{task.description}</p>
                      <div className="flex gap-2">
                        {task.isBlocked ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(task);
                              setIsUnblockModalOpen(true);
                            }}
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(task);
                              setIsBlockModalOpen(true);
                            }}
                          >
                            Block
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-text-muted">
                      No users found. Users will appear here when they register.
                    </p>
                    <p className="text-text-soft text-sm mt-2">
                      Note: You need to implement an endpoint to fetch all users for moderators.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id} variant="elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{user.email}</CardTitle>
                        {user.status === 'BANNED' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900 text-red-400">
                            Banned
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success-soft text-success">
                            Active
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-text-soft">
                          <span className="font-medium">Role:</span> {user.role}
                        </p>
                        {user.createdAt && (
                          <p className="text-sm text-text-soft">
                            <span className="font-medium">Created:</span> {formatDate(user.createdAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {user.status === 'BANNED' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(user);
                              setIsUnblockModalOpen(true);
                            }}
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(user);
                              setIsBlockModalOpen(true);
                            }}
                          >
                            Block
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false);
          setSelectedItem(null);
        }}
        title={`Block ${activeTab === 'tasks' ? 'Task' : 'User'}`}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsBlockModalOpen(false);
                setSelectedItem(null);
              }}
              disabled={isLoadingAction}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleBlock}
              isLoading={isLoadingAction}
            >
              Block
            </Button>
          </>
        }
      >
        <p className="text-text-muted">
          Are you sure you want to block this {activeTab === 'tasks' ? 'task' : 'user'}? 
          {activeTab === 'users' && ' The user will not be able to access the system.'}
        </p>
      </Modal>

      <Modal
        isOpen={isUnblockModalOpen}
        onClose={() => {
          setIsUnblockModalOpen(false);
          setSelectedItem(null);
        }}
        title={`Unblock ${activeTab === 'tasks' ? 'Task' : 'User'}`}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsUnblockModalOpen(false);
                setSelectedItem(null);
              }}
              disabled={isLoadingAction}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleUnblock}
              isLoading={isLoadingAction}
            >
              Unblock
            </Button>
          </>
        }
      >
        <p className="text-text-muted">
          Are you sure you want to unblock this {activeTab === 'tasks' ? 'task' : 'user'}?
        </p>
      </Modal>
    </>
  );
};

