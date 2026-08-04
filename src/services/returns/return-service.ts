/**
 * Returns Service
 * Business service layer for return operations and engine integration.
 */

 import { ReturnRequest, ReturnEvaluationContext, ReturnResult } from '../../domain/returns/return-types';
 import { ReturnsEngine } from '../../domain/returns/return-engine';
 
 export interface ReturnDataSource {
   getReturnById(id: string): Promise<ReturnRequest | null>;
   getReturnsByUserId(userId: string): Promise<ReturnRequest[]>;
   getReturnsByOrderId(orderId: string): Promise<ReturnRequest[]>;
 }
 
 /**
  * Mock Data Source for Returns Development & Testing
  */
 export class MockReturnDataSource implements ReturnDataSource {
   private returns: ReturnRequest[] = [
     {
       id: 'ret-1',
       orderId: 'ord-1001',
       orderItemId: 'item-1',
       userId: 'user-default',
       reason: 'damaged_item',
       status: 'pending_review',
       requestedDate: '2026-08-01T10:00:00.000Z',
       returnWindowDays: 7,
       refundType: 'original_payment_method',
       replacementType: 'none',
       shippingResponsibility: 'seller',
       inspectionResult: 'pending'
     },
     {
       id: 'ret-2',
       orderId: 'ord-1002',
       orderItemId: 'item-2',
       userId: 'user-default',
       reason: 'wrong_item',
       status: 'refunded',
       requestedDate: '2026-07-15T14:30:00.000Z',
       approvalDate: '2026-07-16T09:00:00.000Z',
       returnWindowDays: 14,
       refundType: 'store_credit',
       replacementType: 'none',
       shippingResponsibility: 'marketplace',
       inspectionResult: 'passed'
     }
   ];
 
   async getReturnById(id: string): Promise<ReturnRequest | null> {
     return this.returns.find(r => r.id === id) || null;
   }
 
   async getReturnsByUserId(userId: string): Promise<ReturnRequest[]> {
     return this.returns.filter(r => r.userId === userId);
   }
 
   async getReturnsByOrderId(orderId: string): Promise<ReturnRequest[]> {
     return this.returns.filter(r => r.orderId === orderId);
   }
 }
 
 export class ReturnService {
   private dataSource: ReturnDataSource;
 
   constructor(dataSource: ReturnDataSource = new MockReturnDataSource()) {
     this.dataSource = dataSource;
   }
 
   /**
    * Evaluates if a user can create a return request for a specific order item.
    */
   public evaluateReturnRequest(returnWindowDays: number, context: ReturnEvaluationContext): ReturnResult {
     try {
       return ReturnsEngine.evaluateEligibility(returnWindowDays, context);
     } catch (error) {
       console.error('[ReturnService] Error evaluating return eligibility:', error);
       return {
         isAllowed: false,
         status: 'rejected',
         reason: 'INTERNAL_ERROR',
         message: 'خطایی در پردازش درخواست مرجوعی رخ داد.',
         refundEligibility: false
       };
     }
   }
 
   /**
    * Retrieves all return requests for a specific user.
    */
   public async getUserReturns(userId: string): Promise<ReturnRequest[]> {
     try {
       return await this.dataSource.getReturnsByUserId(userId);
     } catch (error) {
       console.error('[ReturnService] Failed to fetch user returns:', error);
       return [];
     }
   }
   
   /**
    * Retrieves a specific return request by ID.
    */
   public async getReturnDetails(returnId: string): Promise<ReturnRequest | null> {
     try {
       return await this.dataSource.getReturnById(returnId);
     } catch (error) {
       console.error('[ReturnService] Failed to fetch return details:', error);
       return null;
     }
   }
 }
 
 // Singleton instance for convenience
 export const returnService = new ReturnService();