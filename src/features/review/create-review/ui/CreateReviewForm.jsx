import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { reviewApi } from '@entities/review/api/reviewApi';
import { toast } from '@shared/lib/toast';

const createReviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(1, 'Comment is required').optional(),
});

export const CreateReviewForm = ({ assignmentId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 5,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        assignmentId: Number(assignmentId),
        rating: data.rating,
        ...(data.comment && { comment: data.comment }),
      };
      await reviewApi.create(payload);
      reset();
      toast.success('Review created successfully!');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error creating review';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-2">
          Rating (1-5)
        </label>
        <Input
          type="number"
          min="1"
          max="5"
          step="1"
          {...register('rating', { valueAsNumber: true })}
          error={errors.rating?.message}
        />
      </div>
      <div>
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          Comment
        </label>
        <textarea
          {...register('comment')}
          rows={4}
          className="w-full px-4 py-3 text-sm sm:text-base bg-bg-card border border-border-subtle rounded-[12px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-y placeholder:text-text-soft backdrop-blur-sm"
          placeholder="Write your review..."
        />
        {errors.comment && (
          <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.comment.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Submit Review
      </Button>
    </form>
  );
};

