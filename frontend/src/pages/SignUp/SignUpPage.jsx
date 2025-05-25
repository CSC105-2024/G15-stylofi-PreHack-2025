import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import PasswordInput from '@/components/PasswordInput';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signupSchema = z
    .object({
      username: z.string().min(3, 'Username must be at least 3 characters'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'The password must contain at least 6 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const { data } = await api.get("/auth/check");
  //
  //       if (data.authenticated) {
  //         navigate("/dashboard");
  //       }
  //     } catch (error) {
  //       console.error("Auth check failed", error);
  //     }
  //   };
  //
  //   checkAuth();
  // }, [navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post(`/auth/signup`, {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (res.data.success) {
        toast.success('OTP sent to your email');
        setTimeout(() => {
          navigate('/verify-otp', {
            state: { email: data.email },
          });
        }, 750);
      } else {
        setTimeout(() => {
          toast.error(res.data?.msg || 'Signup failed');
        }, 750);
      }
    } catch (err) {
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
          {...register('username')}
          type="text"
          name="username"
          placeholder="Username"
          className="bg-input-background/80 w-80 h-12 border-0 rounded-xl ring-primary"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <Input
          {...register('email')}
          type="email"
          name="email"
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

        <PasswordInput
          register={register}
          name="confirmPassword"
          error={errors.confirmPassword}
          placeholder="Confirm Password"
        />

        <Button
          type="submit"
          disabled={loading}
          className="text-white cursor-pointer active:bg-primary-pressed"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <Link to="/signin">
          <span className="text-primary cursor-pointer hover:underline">Sign in</span>
        </Link>
      </p>
    </>
  );
};

export default SignUpPage;
