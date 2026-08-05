/**
 * Email Configuration Management.
 * Centralizes environment variables required for email delivery operations.
 * Ensures no secrets are hardcoded in the application layer.
 */

export const emailConfig = {
    // Provider selection: 'resend', 'sendgrid', 'smtp', or 'mock' for local development
    provider: process.env.EMAIL_PROVIDER || 'mock',
    
    // Provider API Key (Keep secure in .env)
    apiKey: process.env.EMAIL_API_KEY || '',
    
    // Default sender identity
    fromAddress: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Marketplace Platform',
    
    // Customer support routing
    replyTo: process.env.EMAIL_REPLY_TO || 'support@yourdomain.com',
  };