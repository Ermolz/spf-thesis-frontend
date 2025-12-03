import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { authApi } from '@entities/user/api/userApi';
import { useAuthStore } from '@entities/user/model/store';
import { toast } from '@shared/lib/toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(data);
      const user = {
        id: response.userId,
        email: response.email,
        role: response.role,
      };
      setAuth(user, response.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      const errorCode = err.response?.data?.errors?.[0]?.code;
      let errorMessage = 'Login error';
      
      if (errorCode === 'AUTH_INVALID_CREDENTIALS') {
        errorMessage = 'Неправильний email або пароль';
      } else {
        errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Login error';
      }
      
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
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Sign In
      </Button>
    </form>
  );
};

