import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { CreateProposalForm } from '@features/proposal/create-proposal';
import { UpdateProjectForm } from '@features/project/update-project';
import { ProposalList } from '@widgets/proposal-list';
import { projectApi } from '@entities/project/api/projectApi';
import { proposalApi } from '@entities/proposal/api/proposalApi';
import { assignmentApi } from '@entities/assignment/api/assignmentApi';
import { Loading } from '@shared/ui/Loading';
import { Modal } from '@shared/ui/Modal';
import { formatCurrency, formatDate } from '@shared/lib/utils';
import { toast } from '@shared/lib/toast';
import { useAuthStore } from '@entities/user/model/store';
import { ROLES } from '@shared/config/constants';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    loadProject();
    if (user?.role === ROLES.CLIENT) {
      loadProposals();
    }
  }, [id, user]);

  const loadProject = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      const data = await projectApi.getById(Number(id));
      setProject(data);
    } catch (err) {
      if (!silent) {
        toast.error('Error loading project');
        navigate('/projects');
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const loadProposals = async () => {
    try {
      const params = { page: 0, size: 20 };
      const response = await proposalApi.getByProjectId(Number(id), params);
      const proposalsData = response?.content || response || [];
      setProposals(Array.isArray(proposalsData) ? proposalsData : []);
    } catch (err) {
      toast.error('Error loading proposals');
      setProposals([]);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoadingAction(true);
      await projectApi.publish(Number(id));
      toast.success('Project published!');
      loadProject();
    } catch (err) {
      toast.error('Error publishing project');
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      setIsLoadingAction(true);
      await proposalApi.accept(proposalId);
      
      setProposals((prevProposals) =>
        prevProposals.map((p) =>
          p.id === proposalId ? { ...p, status: 'ACCEPTED' } : p
        )
      );

      const proposal = proposals.find((p) => p.id === proposalId);
      if (proposal) {
        try {
          const startDate = new Date().toISOString();
          await assignmentApi.create({
            proposalId: proposalId,
            startDate: startDate,
          });
          toast.success('Proposal accepted, assignment created!');
        } catch (assignmentErr) {
          const assignmentErrorCode = assignmentErr.response?.data?.errors?.[0]?.code;
          if (assignmentErrorCode === 'ASSIGNMENT_ALREADY_EXISTS') {
            toast.success('Proposal accepted! Assignment already exists for this project.');
          } else {
            const assignmentErrorMessage = assignmentErr.response?.data?.errors?.[0]?.message || assignmentErr.response?.data?.message || 'Proposal accepted, but failed to create assignment';
            toast.error(assignmentErrorMessage);
          }
        }
      }
      
      await Promise.all([loadProposals(), loadProject(true)]);
    } catch (err) {
      const errorCode = err.response?.data?.errors?.[0]?.code;
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error accepting proposal';
      
      if (errorCode === 'PROPOSAL_NOT_PENDING') {
        toast.error('This proposal is no longer pending and cannot be accepted.');
        await loadProposals();
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      setIsLoadingAction(true);
      await proposalApi.reject(proposalId);
      
      setProposals((prevProposals) =>
        prevProposals.map((p) =>
          p.id === proposalId ? { ...p, status: 'REJECTED' } : p
        )
      );
      
      toast.success('Proposal rejected');
      await Promise.all([loadProposals(), loadProject(true)]);
    } catch (err) {
      const errorCode = err.response?.data?.errors?.[0]?.code;
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error rejecting proposal';
      
      if (errorCode === 'PROPOSAL_NOT_PENDING') {
        toast.error('This proposal is no longer pending and cannot be rejected.');
        await loadProposals();
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      setIsLoadingAction(true);
      await projectApi.delete(Number(id));
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error deleting project';
      toast.error(errorMessage);
    } finally {
      setIsLoadingAction(false);
      setIsDeleteModalOpen(false);
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

  if (!project) return null;

  return (
    <>
      <Header />
      <div className="bg-bg-body">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="mb-8 group"
          >
            <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </span>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 fade-in">
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <CardTitle className="text-2xl sm:text-3xl leading-tight">
                      {project.title}
                    </CardTitle>
                    {user?.role === ROLES.CLIENT && (
                      <div className="flex flex-wrap gap-2">
                        {project.status === 'DRAFT' && (
                          <Button
                            onClick={handlePublish}
                            isLoading={isLoadingAction}
                            className="flex-shrink-0"
                          >
                            Publish
                          </Button>
                        )}
                        {project.status === 'DRAFT' && (
                          <Button
                            variant="secondary"
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex-shrink-0"
                          >
                            Edit
                          </Button>
                        )}
                        {project.status === 'DRAFT' && (
                          <Button
                            variant="danger"
                            onClick={() => setIsDeleteModalOpen(true)}
                            isLoading={isLoadingAction}
                            className="flex-shrink-0"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                        Description
                      </h3>
                      <p className="text-text-muted whitespace-pre-wrap leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border-subtle">
                      <div className="p-4 rounded-xl bg-primary-subtle/30 border border-primary/10">
                        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                          Budget
                        </h3>
                        {project.budgetMin && project.budgetMax ? (
                          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
                            {project.currency && ` ${project.currency}`}
                          </p>
                        ) : (
                          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {formatCurrency(project.budget || project.budgetMin || 0)}
                            {project.currency && ` ${project.currency}`}
                          </p>
                        )}
                      </div>
                      <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                          Status
                        </h3>
                        <p className="text-lg font-semibold text-text-main">{project.status}</p>
                      </div>
                    </div>
                    {project.createdAt && (
                      <div className="pt-4 border-t border-border-subtle">
                        <p className="text-sm text-text-soft font-medium">
                          Created: {formatDate(project.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              {user?.role === ROLES.FREELANCER && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Submit Proposal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setIsProposalModalOpen(true)}
                    >
                      Create Proposal
                    </Button>
                  </CardContent>
                </Card>
              )}

              {user?.role === ROLES.CLIENT && proposals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Proposals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProposalList
                      proposals={proposals}
                      onAccept={handleAcceptProposal}
                      onReject={handleRejectProposal}
                      isLoading={isLoadingAction}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        title="Create Proposal"
        size="md"
      >
        <CreateProposalForm
          projectId={Number(id)}
          onSuccess={() => {
            setIsProposalModalOpen(false);
            if (user?.role === ROLES.CLIENT) {
              loadProposals();
            }
          }}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        size="md"
      >
        <UpdateProjectForm
          project={project}
          onSuccess={() => {
            setIsEditModalOpen(false);
            loadProject();
          }}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoadingAction}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteProject}
              isLoading={isLoadingAction}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-text-muted">
          Are you sure you want to delete this project? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

