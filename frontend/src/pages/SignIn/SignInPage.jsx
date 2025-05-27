import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import PasswordInput from '@/components/PasswordInput';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { storeAuthToken } from '@/services/auth';

const SignInPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post(`/auth/signin`, {
        email: data.email,
        password: data.password,
      });
      if (res.data.success) {
        if (res.data.token) {
          storeAuthToken(res.data.token);
        }

        setTimeout(() => {
          toast.success('Login Successful');
          setTimeout(() => {
            navigate('/dashboard');
          }, 750);
        }, 750);
      } else {
        setTimeout(() => {
          toast.error(res.data?.msg || 'Login failed');
        }, 750);
      }
    } catch (err) {
      if (err.response?.data?.msg.includes('OTP')) {
        setTimeout(() => {
          navigate('/verify-otp', {
            state: { email: data.email },
          });
        }, 750);
      }

      setTimeout(() => {
        toast.error(err.response?.data?.msg || 'Server error');
      }, 750);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <>
      <form
        className="space-y-4 flex flex-col justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="bg-input-background/80 w-80 h-12 border-0 rounded-xl ring-primary"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        <PasswordInput
          register={register}
          name="password"
          error={errors.password}
          placeholder="Password"
        />
        <Button
          type="submit"
          disabled={loading}
          className="text-white cursor-pointer active:bg-primary-pressed"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        Don&apos;t have an account?{' '}
        <Link to="/signup">
          <span className="text-primary cursor-pointer hover:underline">Sign up</span>
        </Link>
      </p>
    </>
  );
};

export default SignInPage;
