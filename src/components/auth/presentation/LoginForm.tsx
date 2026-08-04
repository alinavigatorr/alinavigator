'use client';

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
// Assuming Link from next/link or react-router-dom depending on your framework
import Link from 'next/link'; 

export const LoginForm: React.FC = () => {
  const { login, isLoading, authError, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Clear any previous errors before submitting
    await login({ email, password });
    // Note: If successful, the AuthContext state updates and 
    // a higher-level router/guard will redirect the user automatically.
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white tracking-wide">Welcome Back</h2>
        <p className="text-gray-400 mt-2 text-sm">Please sign in to your account</p>
      </div>

      {authError && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {authError}
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

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-400 select-none">Remember me</span>
          </label>

          <Link 
            href="/forgot-password" 
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="animate-pulse">Authenticating...</span>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Register now
        </Link>
      </div>
    </div>
  );
};