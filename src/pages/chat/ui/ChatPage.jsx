import { useState, useEffect } from 'react';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { ChatWindow } from '@widgets/chat-window';
import { Loading } from '@shared/ui/Loading';
import { Button } from '@shared/ui/Button';
import { Modal } from '@shared/ui/Modal';
import { chatApi } from '@entities/chat/api/chatApi';
import { assignmentApi } from '@entities/assignment/api/assignmentApi';
import { projectApi } from '@entities/project/api/projectApi';
import { proposalApi } from '@entities/proposal/api/proposalApi';
import { toast } from '@shared/lib/toast';
import { useAuthStore } from '@entities/user/model/store';
import { ROLES } from '@shared/config/constants';

export const ChatPage = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isLoadingCreateData, setIsLoadingCreateData] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setMessages([]); // Clear messages when conversation changes
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await chatApi.getConversations();
      const conversationsList = Array.isArray(data) ? data : [];
      setConversations(conversationsList);
      if (conversationsList.length > 0 && !selectedConversation) {
        setSelectedConversation(conversationsList[0]);
      }
    } catch (err) {
      toast.error('Error loading conversations');
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedConversation) return;
    try {
      setIsLoadingMessages(true);
      const response = await chatApi.getMessages(selectedConversation.id);
      const messagesData = response?.content || response || [];
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (err) {
      toast.error('Error loading messages');
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content || !content.trim()) return;
    try {
      await chatApi.sendMessage({
        conversationId: selectedConversation.id,
        text: content.trim(),
      });
      await loadMessages();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error sending message';
      toast.error(errorMessage);
    }
  };

  const loadCreateData = async () => {
    try {
      setIsLoadingCreateData(true);
      if (user?.role === ROLES.CLIENT) {
        const [projectsRes, assignmentsRes] = await Promise.all([
          projectApi.getMy({ page: 0, size: 100 }),
          assignmentApi.getClient({ page: 0, size: 100 }),
        ]);
        const projectsData = projectsRes?.content || projectsRes || [];
        const assignmentsData = assignmentsRes?.content || assignmentsRes || [];
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        
        const proposalsPromises = projectsData
          .filter(p => p.id)
          .map(p => proposalApi.getByProjectId(p.id, { page: 0, size: 100 }).catch(() => ({ content: [] })));
        const proposalsResults = await Promise.all(proposalsPromises);
        const allProposals = proposalsResults.flatMap(r => r?.content || r || []);
        setProposals(Array.isArray(allProposals) ? allProposals : []);
      } else {
        const assignmentsRes = await assignmentApi.getMy({ page: 0, size: 100 });
        const assignmentsData = assignmentsRes?.content || assignmentsRes || [];
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      }
    } catch (err) {
      toast.error('Error loading data for creating conversation');
    } finally {
      setIsLoadingCreateData(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    loadCreateData();
  };

  const handleCreateConversation = async () => {
    try {
      setIsCreating(true);
      let requestData = {};
      
      if (selectedAssignmentId) {
        requestData.assignmentId = selectedAssignmentId;
      } else if (selectedProjectId && selectedFreelancerId) {
        requestData.projectId = selectedProjectId;
        requestData.freelancerId = selectedFreelancerId;
      } else {
        toast.error('Please select assignment or project with freelancer');
        return;
      }

      const newConversation = await chatApi.createConversation(requestData);
      toast.success('Conversation created!');
      setIsCreateModalOpen(false);
      setSelectedAssignmentId(null);
      setSelectedProjectId(null);
      setSelectedFreelancerId(null);
      
      // Обновляем список бесед и выбираем новую
      await loadConversations();
      if (newConversation?.id) {
        const updatedConversations = await chatApi.getConversations();
        const conversationsList = Array.isArray(updatedConversations) ? updatedConversations : [];
        const found = conversationsList.find(c => c.id === newConversation.id);
        if (found) {
          setSelectedConversation(found);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error creating conversation';
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const getConversationTitle = (conv) => {
    if (conv.projectTitle) {
      return conv.projectTitle;
    }
    if (conv.freelancerDisplayName) {
      return `Chat with ${conv.freelancerDisplayName}`;
    }
    if (conv.freelancerEmail) {
      return `Chat with ${conv.freelancerEmail}`;
    }
    return `Conversation #${conv.id}`;
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
            Chat
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Conversations</CardTitle>
                    <Button
                      size="sm"
                      onClick={handleOpenCreateModal}
                      className="flex-shrink-0"
                    >
                      + New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {conversations.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-text-muted text-sm mb-4">
                        No active conversations
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleOpenCreateModal}
                      >
                        Create Conversation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Array.isArray(conversations) && conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedConversation?.id === conv.id
                              ? 'bg-primary-subtle text-primary'
                              : 'hover:bg-bg-elevated text-text-main'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {getConversationTitle(conv)}
                              </p>
                              {conv.freelancerDisplayName && (
                                <p className="text-xs text-text-soft mt-1 truncate">
                                  {conv.freelancerDisplayName}
                                </p>
                              )}
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="flex-shrink-0 bg-primary text-text-on-primary text-xs font-semibold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedConversation ? (
                <div className="h-[600px]">
                  <ChatWindow
                    conversationId={selectedConversation.id}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoadingMessages}
                  />
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-text-muted">
                      Select a conversation to start chatting
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedAssignmentId(null);
          setSelectedProjectId(null);
          setSelectedFreelancerId(null);
        }}
        title="Create Conversation"
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreateModalOpen(false);
                setSelectedAssignmentId(null);
                setSelectedProjectId(null);
                setSelectedFreelancerId(null);
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateConversation}
              isLoading={isCreating}
              disabled={!selectedAssignmentId && (!selectedProjectId || !selectedFreelancerId)}
            >
              Create
            </Button>
          </>
        }
      >
        {isLoadingCreateData ? (
          <div className="text-center py-8">
            <Loading />
          </div>
        ) : (
          <div className="space-y-6">
            {user?.role === ROLES.CLIENT && assignments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                  From Assignments
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {assignments.map((assignment) => (
                    <button
                      key={assignment.id}
                      onClick={() => {
                        setSelectedAssignmentId(assignment.id);
                        setSelectedProjectId(null);
                        setSelectedFreelancerId(null);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedAssignmentId === assignment.id
                          ? 'border-primary bg-primary-subtle'
                          : 'border-border-subtle hover:border-primary/50'
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {assignment.projectTitle || `Assignment #${assignment.id}`}
                      </p>
                      {assignment.freelancerDisplayName && (
                        <p className="text-xs text-text-soft mt-1">
                          Freelancer: {assignment.freelancerDisplayName}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {user?.role === ROLES.CLIENT && projects.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                  From Projects
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-2">
                      Select Project
                    </label>
                    <select
                      value={selectedProjectId || ''}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value ? Number(e.target.value) : null);
                        setSelectedFreelancerId(null);
                        setSelectedAssignmentId(null);
                      }}
                      className="w-full p-2 rounded-lg border border-border-subtle bg-bg-card text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">-- Select Project --</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProjectId && (
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-2">
                        Select Freelancer (from proposals)
                      </label>
                      {proposals.filter(p => p.projectId === selectedProjectId).length === 0 ? (
                        <p className="text-sm text-text-soft p-3 bg-bg-elevated rounded-lg">
                          No proposals for this project
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {proposals
                            .filter(p => p.projectId === selectedProjectId)
                            .map((proposal) => (
                              <button
                                key={proposal.id}
                                onClick={() => setSelectedFreelancerId(proposal.freelancerId)}
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                  selectedFreelancerId === proposal.freelancerId
                                    ? 'border-primary bg-primary-subtle'
                                    : 'border-border-subtle hover:border-primary/50'
                                }`}
                              >
                                <p className="text-sm font-medium">
                                  {proposal.freelancerDisplayName || proposal.freelancerEmail || `Freelancer #${proposal.freelancerId}`}
                                </p>
                                {proposal.budget && (
                                  <p className="text-xs text-text-soft mt-1">
                                    Budget: {proposal.budget} {proposal.currency || ''}
                                  </p>
                                )}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {user?.role === ROLES.FREELANCER && assignments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                  From Assignments
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {assignments.map((assignment) => (
                    <button
                      key={assignment.id}
                      onClick={() => {
                        setSelectedAssignmentId(assignment.id);
                        setSelectedProjectId(null);
                        setSelectedFreelancerId(null);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedAssignmentId === assignment.id
                          ? 'border-primary bg-primary-subtle'
                          : 'border-border-subtle hover:border-primary/50'
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {assignment.projectTitle || `Assignment #${assignment.id}`}
                      </p>
                      {assignment.clientEmail && (
                        <p className="text-xs text-text-soft mt-1">
                          Client: {assignment.clientEmail}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(!assignments.length && (!projects.length || user?.role !== ROLES.CLIENT)) && (
              <div className="text-center py-8">
                <p className="text-text-muted text-sm">
                  No assignments or projects available for creating conversation
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

