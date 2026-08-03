// src/hooks/use-review.ts

'use client';

import { useContext } from 'react';
import { ReviewContext } from '@/contexts/ReviewContext';

export const useReview = () => {
  const context = useContext(ReviewContext);

  if (context === undefined) {
    throw new Error('useReview must be used within a ReviewProvider');
  }

  return context;
};