// src/services/auth/auth-errors.ts

export class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class TokenExpiredError extends AuthError {
  constructor(message: string = 'نشست کاربری شما منقضی شده است') {
    super('TOKEN_EXPIRED', message);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message: string = 'توکن احراز هویت نامعتبر است') {
    super('INVALID_TOKEN', message);
    this.name = 'InvalidTokenError';
  }
}

export class UnauthorizedAccessError extends AuthError {
  constructor(message: string = 'شما دسترسی لازم برای این عملیات را ندارید') {
    super('UNAUTHORIZED_ACCESS', message);
    this.name = 'UnauthorizedAccessError';
  }
}

export class SessionNotFoundError extends AuthError {
  constructor(message: string = 'هیچ نشست فعالی یافت نشد') {
    super('SESSION_NOT_FOUND', message);
    this.name = 'SessionNotFoundError';
  }
}