import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/Select';
import { profileApi } from '@entities/user/api/userApi';
import { skillApi } from '@entities/skill/api/skillApi';
import { toast } from '@shared/lib/toast';

const updateFreelancerProfileSchema = z.object({
  displayName: z.string().max(255, 'Display name must be less than 255 characters').optional(),
  bio: z.string().max(5000, 'Bio must be less than 5000 characters').optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
});

export const UpdateFreelancerProfileForm = ({ profile, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState(
    profile?.skills?.map((skillName) => {
      return null;
    }).filter(Boolean) || []
  );
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

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

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setIsLoadingSkills(true);
        const response = await skillApi.getAll();
        const skillsData = response?.data || response || [];
        setAvailableSkills(Array.isArray(skillsData) ? skillsData : []);
        
        if (profile?.skills && Array.isArray(profile.skills)) {
          const skillIds = skillsData
            .filter(skill => profile.skills.includes(skill.name))
            .map(skill => skill.id);
          setSelectedSkillIds(skillIds);
        }
      } catch (err) {
        console.error('Error loading skills:', err);
        toast.error('Error loading skills');
      } finally {
        setIsLoadingSkills(false);
      }
    };
    loadSkills();
  }, [profile]);

  const handleSkillChange = (skillId) => {
    if (skillId && !selectedSkillIds.includes(skillId)) {
      setSelectedSkillIds([...selectedSkillIds, skillId]);
    }
  };

  const removeSkill = (skillId) => {
    setSelectedSkillIds(selectedSkillIds.filter((id) => id !== skillId));
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        ...(data.displayName && { displayName: data.displayName }),
        ...(data.bio && { bio: data.bio }),
        ...(data.hourlyRate && data.hourlyRate > 0 && { hourlyRate: data.hourlyRate }),
        ...(data.currency && { currency: data.currency }),
        ...(selectedSkillIds.length > 0 && { skillIds: selectedSkillIds }),
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
        {isLoadingSkills ? (
          <p className="text-sm text-text-soft">Loading skills...</p>
        ) : (
          <>
            <Select
              placeholder="Select a skill"
              options={availableSkills
                .filter(skill => !selectedSkillIds.includes(skill.id))
                .map(skill => ({ value: skill.id, label: skill.name }))}
              onChange={(value) => handleSkillChange(value)}
              value=""
            />
            {selectedSkillIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSkillIds.map((skillId) => {
                  const skill = availableSkills.find(s => s.id === skillId);
                  if (!skill) return null;
                  return (
                    <span
                      key={skillId}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-subtle text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/10 transition-colors duration-200"
                    >
                      {skill.name}
                      <button
                        type="button"
                        onClick={() => removeSkill(skillId)}
                        className="text-primary hover:text-primary-soft transition-colors duration-200 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </>
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

