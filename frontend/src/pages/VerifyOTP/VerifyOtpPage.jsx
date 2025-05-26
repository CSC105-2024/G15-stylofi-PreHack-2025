import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Loader2 } from 'lucide-react';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [value, setValue] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { handleSubmit, setValue: setFormValue } = useForm();

  const onSubmit = async (data) => {
    if (!email) {
      toast.error('No email provided.');
      return;
    }

    setChecking(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        email,
        otp: data.otp,
      });

      if (res.data.success) {
        toast.success('Email verified!');
        navigate('/signin');
      } else {
        toast.error(res.data.msg || 'OTP verification failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Server error');
    } finally {
      setChecking(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('No email provided.');
      return;
    }

    setIsResending(true);
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('OTP resent!');
      setCooldown(30);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!email) {
      toast.error('No email provided');
      navigate('/signup');
    }
  }, [email, navigate]);

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card className="p-6 shadow-lg border-t-4 border-t-primary">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground mt-2">
            We've sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <label className="text-sm font-medium">Enter verification code</label>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={value}
              onChange={(val) => {
                setValue(val);
                setFormValue('otp', val);
              }}
              className="mx-auto"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-3">
            <Button type="submit" className="w-full" disabled={checking || value.length < 6}>
              {checking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Email
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || isResending}
                className="text-sm"
              >
                {isResending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive a code? Resend"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/signup')} className="text-sm">
            Back to Sign Up
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VerifyOtpPage;
