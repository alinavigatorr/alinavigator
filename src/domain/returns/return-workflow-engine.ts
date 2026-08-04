/**
 * Returns Workflow Engine
 * Pure state machine dictating allowed and blocked transitions across the Returns lifecycle.
 */

 import { WorkflowStep, WorkflowResult } from './return-workflow-types';

 export class ReturnWorkflowEngine {
   /**
    * The directed acyclic graph (DAG) representing allowed state transitions.
    */
   private static transitionMap: Record<WorkflowStep, WorkflowStep[]> = {
     'order_delivered': ['return_requested'],
     'return_requested': ['under_review'],
     'under_review': ['approved', 'rejected'],
     'approved': ['inventory_update'],
     'rejected': ['completed'],
     'inventory_update': ['wallet_refund'],
     'wallet_refund': ['completed'],
     'completed': []
   };
 
   /**
    * Evaluates if a transition from the current step to the target step is allowed by business rules.
    */
   public static evaluateTransition(currentStep: WorkflowStep, targetStep: WorkflowStep): WorkflowResult {
     const allowedNextSteps = this.transitionMap[currentStep] || [];
     const isAllowed = allowedNextSteps.includes(targetStep);
 
     return {
       currentStep: currentStep,
       nextStep: isAllowed ? targetStep : null,
       previousStep: currentStep, // On a stateless engine, the current step becomes the previous step upon transition
       isAllowed: isAllowed,
       blockedReason: isAllowed ? null : `INVALID_TRANSITION: Cannot move from '${currentStep}' directly to '${targetStep}'.`
     };
   }
 
   /**
    * Returns all mathematically possible next steps from the current state.
    */
   public static getAvailableNextSteps(currentStep: WorkflowStep): WorkflowStep[] {
     return this.transitionMap[currentStep] || [];
   }
 }