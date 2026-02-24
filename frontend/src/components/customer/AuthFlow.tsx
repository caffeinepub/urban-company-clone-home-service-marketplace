import React, { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Phone, Shield, ArrowRight, Home } from 'lucide-react';

interface AuthFlowProps {
  onSuccess: () => void;
}

export default function AuthFlow({ onSuccess }: AuthFlowProps) {
  const { login, loginStatus, isLoggingIn } = useInternetIdentity();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleLogin = async () => {
    try {
      await login();
      onSuccess();
    } catch {
      // handled by loginStatus
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-16 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">ServeEase</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-white/80 text-sm">Sign in to book home services</p>
      </div>

      {/* Card */}
      <div className="flex-1 -mt-8 bg-background rounded-t-3xl px-6 pt-8 pb-6">
        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Enter your phone</h2>
              <p className="text-sm text-muted-foreground">We'll send you a verification code</p>
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-12 rounded-xl border-border"
                maxLength={15}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl gradient-primary text-white font-semibold border-0"
              disabled={phone.length < 10}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Verify OTP</h2>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to {phone}
              </p>
            </div>

            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-12 rounded-xl text-center text-2xl tracking-widest border-border"
              maxLength={6}
            />

            <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                This app uses Internet Identity for secure, passwordless authentication. Click below to sign in.
              </p>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-12 rounded-xl gradient-primary text-white font-semibold border-0"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In Securely
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <button
              onClick={() => setStep('phone')}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Change phone number
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
