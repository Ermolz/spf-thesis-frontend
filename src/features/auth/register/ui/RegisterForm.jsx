import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/Select';
import { authApi } from '@entities/user/api/userApi';
import { useAuthStore } from '@entities/user/model/store';
import { ROLES } from '@shared/config/constants';
import { toast } from '@shared/lib/toast';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum([ROLES.FREELANCER, ROLES.CLIENT]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const RegisterForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: ROLES.FREELANCER,
    },
  });

  const roleOptions = [
    { value: ROLES.FREELANCER, label: 'Freelancer' },
    { value: ROLES.CLIENT, label: 'Client' },
  ];

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(data);
      const user = {
        id: response.userId,
        email: response.email,
        role: response.role,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      setAuth(user, response.token);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Registration error';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Select
            label="Role"
            value={field.value}
            onChange={field.onChange}
            options={roleOptions}
            placeholder="Select role"
            error={errors.role?.message}
          />
        )}
      />
      <Input
        label="First Name (optional)"
        {...register('firstName')}
        error={errors.firstName?.message}
      />
      <Input
        label="Last Name (optional)"
        {...register('lastName')}
        error={errors.lastName?.message}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Sign Up
      </Button>
    </form>
  );
};

