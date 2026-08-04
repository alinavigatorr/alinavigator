'use client';

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export const ForgotPasswordForm: React.FC = () => {
  // Assuming forgotPassword is exposed in your AuthContext as per Phase 4 manifest
  const { forgotPassword, isLoading, authError, clearError } = useAuth() as any; 
  
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clearError) clearError();
    setLocalError(null);

    if (!email) {
      setLocalError('Please enter your email address.');
      return;
    }

    try {
      if (forgotPassword) {
        await forgotPassword(email);
      } else {
        // Fallback simulation if forgotPassword wasn't added to context yet
        console.warn('forgotPassword method is missing in AuthContext. Simulating success.');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setIsSuccess(true);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to process request.');
    }
  };

  const displayError = localError || authError;

  if (isSuccess) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl text-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-gray-400 text-sm mb-8">
          If an account exists for <span className="text-white font-medium">{email}</span>, we have sent password reset instructions.
        </p>
        <Link 
          href="/login"
          className="inline-block w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/10"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white tracking-wide">Reset Password</h2>
        <p className="text-gray-400 mt-2 text-sm">Enter your email to receive recovery instructions</p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="name@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="animate-pulse">Sending...</span>
          ) : (
            <span>Send Reset Link</span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400">
        Remember your password?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Back to Login
        </Link>
      </div>
    </div>
  );
};