import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { profileApi } from '@entities/user/api/userApi';
import { toast } from '@shared/lib/toast';

const updateFreelancerProfileSchema = z.object({
  displayName: z.string().max(255, 'Display name must be less than 255 characters').optional(),
  bio: z.string().max(5000, 'Bio must be less than 5000 characters').optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
});

export const UpdateFreelancerProfileForm = ({ profile, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState(profile?.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(updateFreelancerProfileSchema),
    defaultValues: {
      displayName: profile?.displayName || '',
      bio: profile?.bio || '',
      hourlyRate: profile?.hourlyRate || 0,
      currency: profile?.currency || 'USD',
    },
  });

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        ...(data.displayName && { displayName: data.displayName }),
        ...(data.bio && { bio: data.bio }),
        ...(data.hourlyRate && data.hourlyRate > 0 && { hourlyRate: data.hourlyRate }),
        ...(data.currency && { currency: data.currency }),
        ...(skills.length > 0 && { skills }),
      };
      await profileApi.updateFreelancerProfile(payload);
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
        label="Display Name"
        {...register('displayName')}
        error={errors.displayName?.message}
        placeholder="Your public display name"
      />
      <div>
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          Bio
        </label>
        <textarea
          {...register('bio')}
          rows={4}
          className="w-full px-4 py-3 text-sm sm:text-base bg-bg-card border border-border-subtle rounded-[12px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-y placeholder:text-text-soft backdrop-blur-sm"
          placeholder="Tell us about yourself..."
        />
        {errors.bio && (
          <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          Skills
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button type="button" onClick={addSkill} variant="secondary">
            Add
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-subtle text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/10 transition-colors duration-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-primary hover:text-primary-soft transition-colors duration-200 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Hourly Rate"
          type="number"
          step="0.01"
          {...register('hourlyRate', { valueAsNumber: true })}
          error={errors.hourlyRate?.message}
          placeholder="0.00"
        />
        <Input
          label="Currency"
          {...register('currency')}
          error={errors.currency?.message}
          placeholder="USD"
          maxLength={3}
        />
      </div>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Update Profile
      </Button>
    </form>
  );
};

