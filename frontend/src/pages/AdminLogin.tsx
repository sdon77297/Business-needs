import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, Key, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid advisor email'),
  password: z.string().min(6, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  const fillDemoAdmin = () => {
    setValue('email', 'admin@mfefwealth.com');
    setValue('password', 'MFEF_Wealth_2026!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 text-platinum-100">
      <div className="max-w-md w-full bg-obsidian-900 border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-luxury space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400 font-luxury text-xl">
            ⚜
          </div>
          <h1 className="text-2xl font-bold font-luxury text-platinum-100">
            Partner Portal Login
          </h1>
          <p className="text-xs text-platinum-400">
            Encrypted access to MFEF Lead & Consultation CRM.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
              Advisor Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="partner@mfefwealth.com"
                {...register('email')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-xs text-platinum-100"
              />
            </div>
            {errors.email && (
              <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-platinum-300 font-semibold mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gold-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                {...register('password')}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 focus:outline-none text-xs text-platinum-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-platinum-500 hover:text-platinum-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs uppercase tracking-widest font-bold hover:shadow-gold-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Partner Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In To Partner CRM</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials Box */}
        <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 text-xs text-platinum-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-platinum-200">Demo Testing Credentials:</span>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="text-gold-400 hover:text-gold-300 font-semibold text-[11px] underline"
            >
              Auto-Fill
            </button>
          </div>
          <div className="font-mono text-[11px] text-platinum-300">
            Email: <span className="text-gold-400">admin@mfefwealth.com</span>
            <br />
            Password: <span className="text-gold-400">MFEF_Wealth_2026!</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-[11px] text-platinum-500">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
          <span>Fiduciary RBAC protected • Multi-device session controls</span>
        </div>
      </div>
    </div>
  );
};
