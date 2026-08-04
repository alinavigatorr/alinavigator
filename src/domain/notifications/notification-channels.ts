export const NotificationChannel = {
    IN_APP: 'IN_APP',
    EMAIL: 'EMAIL',
    SMS: 'SMS',
    PUSH: 'PUSH',
    WEBHOOK: 'WEBHOOK',
  } as const;
  
  export type NotificationChannel = typeof NotificationChannel[keyof typeof NotificationChannel];