import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { Loading } from '@shared/ui/Loading';
import { Modal } from '@shared/ui/Modal';
import { proposalApi } from '@entities/proposal/api/proposalApi';
import { formatCurrency, formatDate } from '@shared/lib/utils';
import { toast } from '@shared/lib/toast';

export const ProposalsPage = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      setIsLoading(true);
      const params = { page: 0, size: 20 };
      const response = await proposalApi.getMy(params);
      const proposalsData = response?.content || response || [];
      setProposals(Array.isArray(proposalsData) ? proposalsData : []);
    } catch (err) {
      toast.error('Error loading proposals');
      setProposals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedProposalId) return;
    try {
      setIsLoadingAction(true);
      await proposalApi.withdraw(selectedProposalId);
      toast.success('Proposal withdrawn');
      setIsWithdrawModalOpen(false);
      setSelectedProposalId(null);
      loadProposals();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error withdrawing proposal';
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
            My Proposals
          </h1>

          {!proposals || proposals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-text-muted text-lg">
                  You don't have any proposals yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Array.isArray(proposals) && proposals.map((proposal) => (
                <Card key={proposal.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <CardTitle>Proposal #{proposal.id}</CardTitle>
                      <span className="text-sm text-text-soft">
                        {formatDate(proposal.createdAt)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-muted mb-4 leading-relaxed">{proposal.coverLetter || proposal.message}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {formatCurrency(proposal.bidAmount || proposal.proposedBudget)}
                        </span>
                        {proposal.estimatedDuration && (
                          <p className="text-sm text-text-soft mt-1">
                            Estimate: {proposal.estimatedDuration} days
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        proposal.status === 'PENDING' ? 'bg-primary-subtle text-primary' :
                        proposal.status === 'ACCEPTED' ? 'bg-success-soft text-success' :
                        proposal.status === 'REJECTED' ? 'bg-red-900 text-red-400' :
                        'bg-accent-soft text-accent'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border-subtle">
                      {proposal.projectId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/projects/${proposal.projectId}`)}
                        >
                          View Project
                        </Button>
                      )}
                      {proposal.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProposalId(proposal.id);
                            setIsWithdrawModalOpen(true);
                          }}
                        >
                          Withdraw
                        </Button>
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
        isOpen={isWithdrawModalOpen}
        onClose={() => {
          setIsWithdrawModalOpen(false);
          setSelectedProposalId(null);
        }}
        title="Withdraw Proposal"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsWithdrawModalOpen(false);
                setSelectedProposalId(null);
              }}
              disabled={isLoadingAction}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleWithdraw}
              isLoading={isLoadingAction}
            >
              Withdraw
            </Button>
          </>
        }
      >
        <p className="text-text-muted">
          Are you sure you want to withdraw this proposal? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

