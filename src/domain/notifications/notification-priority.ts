export const NotificationPriority = {
    LOW: 'LOW',
    NORMAL: 'NORMAL',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
  } as const;
  
  export type NotificationPriority = typeof NotificationPriority[keyof typeof NotificationPriority];