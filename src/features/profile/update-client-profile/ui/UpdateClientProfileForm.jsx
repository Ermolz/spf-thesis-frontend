import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { profileApi } from '@entities/user/api/userApi';
import { toast } from '@shared/lib/toast';

const updateClientProfileSchema = z.object({
  companyName: z.string().max(255, 'Company name must be less than 255 characters').optional(),
  bio: z.string().max(5000, 'Bio must be less than 5000 characters').optional(),
});

export const UpdateClientProfileForm = ({ profile, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateClientProfileSchema),
    defaultValues: {
      companyName: profile?.companyName || '',
      bio: profile?.bio || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        ...(data.companyName && { companyName: data.companyName }),
        ...(data.bio && { bio: data.bio }),
      };
      await profileApi.updateClientProfile(payload);
      toast.success('Profile updated successfully!');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Error updating profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Company Name"
        {...register('companyName')}
        error={errors.companyName?.message}
        placeholder="Your company or organization name"
      />
      <div>
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          Company Description
        </label>
        <textarea
          {...register('bio')}
          rows={4}
          className="w-full px-4 py-3 text-sm sm:text-base bg-bg-card border border-border-subtle rounded-[12px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-y placeholder:text-text-soft backdrop-blur-sm"
          placeholder="Tell us about your company..."
        />
        {errors.bio && (
          <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Update Profile
      </Button>
    </form>
  );
};

