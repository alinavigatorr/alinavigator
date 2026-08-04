// src/services/reviews/review-policy.ts

export const ReviewPolicy = {
  rules: {
    title: {
      minLength: 3,
      maxLength: 100,
    },
    body: {
      minLength: 10,
      maxLength: 1000,
    },
    rating: {
      min: 1,
      max: 5,
    }
  }
} as const;