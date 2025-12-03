import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { proposalApi } from '@entities/proposal/api/proposalApi';
import { toast } from '@shared/lib/toast';

const createProposalSchema = z.object({
  coverLetter: z.string().min(1, 'Cover letter is required'),
  bidAmount: z.number({ invalid_type_error: 'Bid amount is required' })
    .min(0.01, 'Bid amount must be greater than 0')
    .max(9999999999.99, 'Bid amount must not exceed 9999999999.99')
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: 'Bid amount can have at most two decimal places',
    }),
  estimatedDuration: z.number().int().positive().optional(),
});

export const CreateProposalForm = ({ projectId, project, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projectStatus, setProjectStatus] = useState(null);

  useEffect(() => {
    // Load project if not provided
    if (project) {
      setProjectStatus(project.status);
    } else if (projectId) {
      const loadProject = async () => {
        try {
          const data = await projectApi.getById(Number(projectId));
          setProjectStatus(data?.status || data?.data?.status);
        } catch (err) {
          console.error('Error loading project:', err);
        }
      };
      loadProject();
    }
  }, [projectId, project]);

  useEffect(() => {
    // Show warning if project is not OPEN
    if (projectStatus && projectStatus !== 'OPEN') {
      toast.error('This project is not open for proposals');
    }
  }, [projectStatus]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createProposalSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        projectId: Number(projectId),
        coverLetter: data.coverLetter,
        bidAmount: data.bidAmount,
        ...(data.estimatedDuration && { estimatedDuration: data.estimatedDuration }),
      };
      await proposalApi.create(payload);
      reset();
      toast.success('Proposal sent successfully!');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error creating proposal';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (projectStatus && projectStatus !== 'OPEN') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">
          This project is not open for proposals. Current status: {projectStatus}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          Cover Letter
        </label>
        <textarea
          {...register('coverLetter')}
          rows={6}
          placeholder="Tell us why you're a good fit for this project..."
          className="w-full px-4 py-3 text-sm sm:text-base bg-bg-card border border-border-subtle rounded-[12px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-y placeholder:text-text-soft backdrop-blur-sm"
        />
        {errors.coverLetter && (
          <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.coverLetter.message}</p>
        )}
      </div>
      <Input
        label="Bid Amount"
        type="number"
        step="0.01"
        {...register('bidAmount', { valueAsNumber: true })}
        error={errors.bidAmount?.message}
      />
      <Input
        label="Estimated Duration (days, optional)"
        type="number"
        step="1"
        {...register('estimatedDuration', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })}
        error={errors.estimatedDuration?.message}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Submit Proposal
      </Button>
    </form>
  );
};

