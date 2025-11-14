import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/Select';
import { DatePicker } from '@shared/ui/DatePicker';
import { projectApi } from '@entities/project/api/projectApi';
import { categoryApi } from '@entities/category/api';
import { toast } from '@shared/lib/toast';

const updateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  budgetMin: z.number().min(0.01, 'Minimum budget must be greater than 0').optional(),
  budgetMax: z.number().min(0.01, 'Maximum budget must be greater than 0').optional(),
  currency: z.string().length(3, 'Currency must contain 3 characters').optional(),
  categoryId: z.number().optional(),
  tagNames: z.array(z.string()).optional(),
  deadline: z.string().optional(),
}).refine((data) => !data.budgetMax || !data.budgetMin || data.budgetMax >= data.budgetMin, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

export const UpdateProjectForm = ({ project, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState(project?.tagNames || []);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: project ? {
      title: project.title || '',
      description: project.description || '',
      budgetMin: project.budgetMin || 0,
      budgetMax: project.budgetMax || 0,
      currency: project.currency || 'USD',
      categoryId: project.categoryId || undefined,
      deadline: project.deadline ? new Date(project.deadline).toISOString().slice(0, 16) : undefined,
    } : {},
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await categoryApi.getAll();
        const categoriesList = Array.isArray(data) ? data : (data?.data || []);
        setCategories(categoriesList);
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (project) {
      reset({
        title: project.title || '',
        description: project.description || '',
        budgetMin: project.budgetMin || 0,
        budgetMax: project.budgetMax || 0,
        currency: project.currency || 'USD',
        categoryId: project.categoryId || undefined,
        deadline: project.deadline ? new Date(project.deadline).toISOString().slice(0, 16) : undefined,
      });
      setTags(project.tagNames || []);
    }
  }, [project, reset]);

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name || cat.categoryName || `Category ${cat.id}`,
  }));

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tagNames', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue('tagNames', newTags);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {};
      if (data.title) payload.title = data.title;
      if (data.description) payload.description = data.description;
      if (data.budgetMin) payload.budgetMin = data.budgetMin;
      if (data.budgetMax) payload.budgetMax = data.budgetMax;
      if (data.currency) payload.currency = data.currency.toUpperCase();
      if (data.categoryId) payload.categoryId = data.categoryId;
      if (tags.length > 0) payload.tagNames = tags;
      if (data.deadline) {
        payload.deadline = new Date(data.deadline).toISOString();
      }
      await projectApi.update(project.id, payload);
      toast.success('Project updated successfully!');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error updating project';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Project Title"
        {...register('title')}
        error={errors.title?.message}
      />
      <div>
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={6}
          className="w-full px-4 py-3 text-sm sm:text-base bg-bg-card border border-border-subtle rounded-[12px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-y placeholder:text-text-soft backdrop-blur-sm"
        />
        {errors.description && (
          <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Minimum Budget"
          type="number"
          step="0.01"
          {...register('budgetMin', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })}
          error={errors.budgetMin?.message}
        />
        <Input
          label="Maximum Budget"
          type="number"
          step="0.01"
          {...register('budgetMax', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })}
          error={errors.budgetMax?.message}
        />
      </div>
      <Input
        label="Currency (3 characters, e.g. USD)"
        maxLength={3}
        {...register('currency')}
        error={errors.currency?.message}
      />
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <Select
            label="Category (optional)"
            value={field.value}
            onChange={(value) => field.onChange(value ? Number(value) : undefined)}
            options={categoryOptions}
            placeholder={isLoadingCategories ? 'Loading categories...' : 'Select category'}
            error={errors.categoryId?.message}
          />
        )}
      />
      <div>
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          Tags (optional)
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" onClick={addTag} variant="secondary">
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-subtle text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/10 transition-colors duration-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-primary hover:text-primary-soft transition-colors duration-200 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
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
        Update Project
      </Button>
    </form>
  );
};

