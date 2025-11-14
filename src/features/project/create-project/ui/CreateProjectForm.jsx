import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/Select';
import { DatePicker } from '@shared/ui/DatePicker';
import { projectApi } from '@entities/project/api/projectApi';
import { categoryApi } from '@entities/category/api';
import { toast } from '@shared/lib/toast';

const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  budgetMin: z.number().min(0.01, 'Minimum budget must be greater than 0'),
  budgetMax: z.number().min(0.01, 'Maximum budget must be greater than 0'),
  currency: z.string().length(3, 'Currency must contain 3 characters'),
  categoryId: z.number().optional(),
  tagNames: z.array(z.string()).optional(),
  deadline: z.string().optional(),
}).refine((data) => data.budgetMax >= data.budgetMin, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

export const CreateProjectForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      currency: 'USD',
    },
  });

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

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name || cat.categoryName || `Category ${cat.id}`,
  }));

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        title: data.title,
        description: data.description,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        currency: data.currency.toUpperCase(),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(tags.length > 0 && { tagNames: tags }),
        ...(data.deadline && {
          deadline: new Date(data.deadline).toISOString(),
        }),
      };
      await projectApi.create(payload);
      toast.success('Project created successfully!');
      navigate('/projects');
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error creating project';
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
          {...register('budgetMin', { valueAsNumber: true })}
          error={errors.budgetMin?.message}
        />
        <Input
          label="Maximum Budget"
          type="number"
          step="0.01"
          {...register('budgetMax', { valueAsNumber: true })}
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
        Create Project
      </Button>
    </form>
  );
};

