import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { formatCurrency, formatDate } from '@shared/lib/utils';
import { Button } from '@shared/ui/Button';

export const ProposalList = ({ proposals, onAccept, onReject, isLoading }) => {
  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center py-8 text-text-soft">
        No proposals
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-primary-subtle text-primary';
      case 'ACCEPTED':
        return 'bg-success-soft text-success';
      case 'REJECTED':
        return 'bg-red-900 text-red-400';
      case 'WITHDRAWN':
        return 'bg-accent-soft text-accent';
      default:
        return 'bg-primary-subtle text-text-muted';
    }
  };

  return (
    <div className="space-y-4">
      {proposals.map((proposal, index) => {
        const isPending = proposal.status === 'PENDING';
        return (
          <Card key={proposal.id} className="group">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors duration-200">
                    Proposal #{index + 1}
                  </CardTitle>
                  {proposal.status && (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-soft font-medium">
                  {formatDate(proposal.createdAt)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-text-muted mb-5 leading-relaxed">
                {proposal.coverLetter || proposal.message}
              </p>
              {proposal.freelancerDisplayName && (
                <div className="mb-4 p-3 rounded-lg bg-bg-elevated border border-border-subtle">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                    From
                  </p>
                  {proposal.freelancerUserId ? (
                    <Link
                      to={`/freelancers/${proposal.freelancerUserId}`}
                      className="text-sm font-medium text-primary hover:text-primary-soft transition-colors"
                    >
                      {proposal.freelancerDisplayName}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium text-text-main">
                      {proposal.freelancerDisplayName}
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border-subtle">
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatCurrency(proposal.bidAmount || proposal.proposedBudget)}
                  </span>
                  {proposal.estimatedDuration && (
                    <p className="text-xs text-text-soft font-medium mt-1">
                      Estimate: {proposal.estimatedDuration} days
                    </p>
                  )}
                </div>
                {onAccept && onReject && isPending && (
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onAccept(proposal.id)}
                      isLoading={isLoading}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onReject(proposal.id)}
                      isLoading={isLoading}
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {!isPending && (
                  <p className="text-sm text-text-muted italic">
                    This proposal cannot be modified
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

