'use client';

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export const RegisterForm: React.FC = () => {
  const { register, isLoading, authError, clearError } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (!acceptTerms) {
      setLocalError('You must accept the terms and conditions.');
      return;
    }

    await register({
      email,
      password,
      firstName,
      lastName,
    });
  };

  const displayError = localError || authError;

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white tracking-wide">Create Account</h2>
        <p className="text-gray-400 mt-2 text-sm">Join us to get started</p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-300">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              placeholder="John"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-300">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              placeholder="Doe"
            />
          </div>
        </div>

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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>

        <label className="flex items-start gap-3 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            disabled={isLoading}
            className="mt-1 w-4 h-4 rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0 shrink-0"
          />
          <span className="text-sm text-gray-400 select-none">
            I agree to the{' '}
            <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="animate-pulse">Creating Account...</span>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};