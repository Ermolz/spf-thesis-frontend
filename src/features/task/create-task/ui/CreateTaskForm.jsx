import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/Select';
import { DatePicker } from '@shared/ui/DatePicker';
import { taskApi } from '@entities/task/api/taskApi';
import { toast } from '@shared/lib/toast';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).optional(),
  deadline: z.string().optional(),
});

export const CreateTaskForm = ({ assignmentId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: 'TODO',
    },
  });

  const statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'BLOCKED', label: 'Blocked' },
  ];

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        assignmentId: Number(assignmentId),
        title: data.title,
        ...(data.description && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.deadline && {
          deadline: new Date(data.deadline).toISOString(),
        }),
      };
      await taskApi.create(payload);
      reset();
      toast.success('Task created successfully!');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error creating task';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Task Title"
        {...register('title')}
        error={errors.title?.message}
      />
      <div>
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-3 text-sm sm:text-base bg-bg-card border border-border-subtle rounded-[12px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-y placeholder:text-text-soft backdrop-blur-sm"
        />
        {errors.description && (
          <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select
            label="Status"
            value={field.value}
            onChange={field.onChange}
            options={statusOptions}
            error={errors.status?.message}
          />
        )}
      />
      <Controller
        name="deadline"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Deadline (optional)"
            value={field.value}
            onChange={field.onChange}
            error={errors.deadline?.message}
          />
        )}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create Task
      </Button>
    </form>
  );
};

