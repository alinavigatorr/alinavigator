export type SimulationMode = 'SUCCESS' | 'FAILURE' | 'TIMEOUT' | 'CANCELLED';

export interface SimulationConfig {
  mode: SimulationMode;
  processingDelay: number;
  failureDelay: number;
  timeoutDelay: number;
  allowRetry: boolean;
  allowCancel: boolean;
}

export const defaultSimulationConfig: SimulationConfig = {
  mode: 'SUCCESS', // Change this value to test different gateway scenarios
  processingDelay: 2500,
  failureDelay: 2000,
  timeoutDelay: 5000,
  allowRetry: true,
  allowCancel: true
};