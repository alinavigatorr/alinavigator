export interface ApiConfig {
  baseUrl: string;
  version: string;
  timeout: number;
  retries: number;
}

export const defaultConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  version: 'v1', // Placeholder: API Versioning
  timeout: 10000, 
  retries: 0,
};