import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { Loading } from '@shared/ui/Loading';
import { Modal } from '@shared/ui/Modal';
import { CreateReviewForm } from '@features/review/create-review';
import { reviewApi } from '@entities/review/api/reviewApi';
import { formatDate } from '@shared/lib/utils';
import { toast } from '@shared/lib/toast';
import { useAuthStore } from '@entities/user/model/store';
import { ROLES } from '@shared/config/constants';

export const ReviewsPage = () => {
  const [searchParams] = useSearchParams();
  const freelancerId = searchParams.get('freelancerId');
  const clientId = searchParams.get('clientId');
  const assignmentId = searchParams.get('assignmentId');
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [freelancerId, clientId, assignmentId]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const params = { page: 0, size: 20 };
      let data;
      if (assignmentId) {
        data = await reviewApi.getByAssignment(Number(assignmentId), params);
      } else if (clientId) {
        data = await reviewApi.getByClient(Number(clientId), params);
      } else if (freelancerId) {
        data = await reviewApi.getByFreelancer(Number(freelancerId), params);
      } else {
        setReviews([]);
        setIsLoading(false);
        return;
      }
      const reviewsList = data?.content || data || [];
      setReviews(Array.isArray(reviewsList) ? reviewsList : []);
    } catch (err) {
      toast.error('Error loading reviews');
      setReviews([]);
    } finally {
      setIsLoading(false);
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
              Reviews
            </h1>
            {assignmentId && user?.role === ROLES.CLIENT && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Review
              </Button>
            )}
          </div>

          {!freelancerId && !clientId && !assignmentId ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-text-muted text-lg">
                  Select a freelancer, client, or assignment to view reviews
                </p>
              </CardContent>
            </Card>
          ) : !reviews || reviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-text-muted text-lg">No reviews yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Array.isArray(reviews) && reviews.map((review) => (
                <Card key={review.id} variant="elevated">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg sm:text-xl">Review #{review.id}</CardTitle>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < review.rating
                                  ? 'text-warning'
                                  : 'text-text-soft'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-text-soft font-medium">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {review.comment && (
                      <p className="text-text-muted leading-relaxed">{review.comment}</p>
                    )}
                    {review.reviewerDisplayName && (
                      <p className="text-sm text-text-soft mt-3">
                        By: {review.reviewerDisplayName}
                      </p>
                    )}
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
        title="Create Review"
        size="md"
      >
        <CreateReviewForm
          assignmentId={Number(assignmentId)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            loadReviews();
          }}
        />
      </Modal>
    </>
  );
};

