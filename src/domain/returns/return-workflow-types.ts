/**
 * Returns Workflow Types
 * Defines the state machine steps and transition structures for Return Orchestration.
 */

 import { ReturnStatus, RefundType } from './return-types';

 export type WorkflowStep = 
   | 'order_delivered'      // Initial state before return
   | 'return_requested'     // Return Request
   | 'under_review'         // Review
   | 'approved'             // Approved (Branch A)
   | 'rejected'             // Rejected (Branch B)
   | 'inventory_update'     // Inventory Update (Mock)
   | 'wallet_refund'        // Wallet Refund (Mock)
   | 'completed';           // Complete
 
 export interface WorkflowTransition {
   currentStep: WorkflowStep;
   targetStep: WorkflowStep;
   actionName: string;
 }
 
 export interface WorkflowResult {
   currentStep: WorkflowStep;
   nextStep: WorkflowStep | null;
   previousStep: WorkflowStep | null;
   isAllowed: boolean;
   blockedReason: string | null;
 }