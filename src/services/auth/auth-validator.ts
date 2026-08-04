export interface AuthValidationResult {
    isValid: boolean;
    errors: string[];
  }
  
  export class AuthValidator {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
  
    public static validateEmailFormat(email?: string): AuthValidationResult {
      const errors: string[] = [];
      if (!email || email.trim() === '') {
        errors.push('Email is required.');
      } else if (!this.EMAIL_REGEX.test(email)) {
        errors.push('Invalid email format.');
      }
      return { isValid: errors.length === 0, errors };
    }
  
    public static validateUsernameFormat(username?: string): AuthValidationResult {
      const errors: string[] = [];
      if (!username || username.trim() === '') {
        errors.push('Username is required.');
      } else if (!this.USERNAME_REGEX.test(username)) {
        errors.push('Username must be 3-20 characters long and contain only letters, numbers, underscores, or hyphens.');
      }
      return { isValid: errors.length === 0, errors };
    }
  
    public static validateLoginCredentials(email?: string, password?: string): AuthValidationResult {
      const errors: string[] = [];
      
      const emailValidation = this.validateEmailFormat(email);
      if (!emailValidation.isValid) {
        errors.push(...emailValidation.errors);
      }
  
      if (!password || password.trim() === '') {
        errors.push('Password is required.');
      }
  
      return { isValid: errors.length === 0, errors };
    }
  
    public static validateRegistration(
      email: string | undefined,
      username: string | undefined,
      isEmailTaken: boolean,
      isUsernameTaken: boolean
    ): AuthValidationResult {
      const errors: string[] = [];
  
      const emailValidation = this.validateEmailFormat(email);
      if (!emailValidation.isValid) {
        errors.push(...emailValidation.errors);
      } else if (isEmailTaken) {
        errors.push('Email is already registered.');
      }
  
      const usernameValidation = this.validateUsernameFormat(username);
      if (!usernameValidation.isValid) {
        errors.push(...usernameValidation.errors);
      } else if (isUsernameTaken) {
        errors.push('Username is already taken.');
      }
  
      return { isValid: errors.length === 0, errors };
    }
  }