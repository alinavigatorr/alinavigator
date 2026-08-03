/**
 * Returns Workflow Service
 * Orchestrates the return process across service boundaries (Orders, Inventory, Wallet).
 */

 import { WorkflowStep, WorkflowResult } from '../../domain/returns/return-workflow-types';
 import { ReturnWorkflowEngine } from '../../domain/returns/return-workflow-engine';
 import { RefundType } from '../../domain/returns/return-types';
 
 // Mock External Service Interfaces representing cross-domain boundaries
 interface MockInventoryService {
   restockItem(orderItemId: string, quantity: number): Promise<boolean>;
 }
 
 interface MockWalletService {
   processRefund(userId: string, amount: number, type: RefundType): Promise<boolean>;
 }
 
 export class ReturnWorkflowService {
   private inventoryService: MockInventoryService;
   private walletService: MockWalletService;
 
   constructor() {
     // Mock implementations isolating external business domains
     this.inventoryService = {
       restockItem: async (id, qty) => {
         console.log(`[Inventory Service] Restocked item ${id} (Qty: ${qty})`);
         return true;
       }
     };
     
     this.walletService = {
       processRefund: async (userId, amount, type) => {
         console.log(`[Wallet Service] Refunded ${amount} to user ${userId} via ${type}`);
         return true;
       }
     };
   }
 
   /**
    * Attempts to transition a return process to the next step and executes required side-effects.
    */
   public async advanceWorkflow(
     currentStep: WorkflowStep, 
     targetStep: WorkflowStep, 
     context: { userId: string, orderItemId: string, refundAmount: number, refundType: RefundType }
   ): Promise<WorkflowResult> {
     
     const evaluation = ReturnWorkflowEngine.evaluateTransition(currentStep, targetStep);
 
     if (!evaluation.isAllowed) {
       console.warn(`[Workflow Service] Transition Blocked: ${evaluation.blockedReason}`);
       return evaluation;
     }
 
     // Orchestrate cross-domain side effects based on the target step safely
     try {
       switch (targetStep) {
         case 'inventory_update':
           await this.inventoryService.restockItem(context.orderItemId, 1);
           break;
         case 'wallet_refund':
           await this.walletService.processRefund(context.userId, context.refundAmount, context.refundType);
           break;
         case 'completed':
           console.log(`[Workflow Service] Return workflow completed for user ${context.userId}`);
           break;
       }
     } catch (error) {
       return {
         ...evaluation,
         isAllowed: false,
         blockedReason: `CROSS_DOMAIN_ERROR: Failed to execute side-effects for ${targetStep}`
       };
     }
 
     return evaluation;
   }
 }
 
 // Singleton instance for integration
 export const returnWorkflowService = new ReturnWorkflowService();