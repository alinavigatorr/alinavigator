/**
 * Returns Domain Types
 * Core data structures for the Commerce Growth Platform Returns Engine.
 */

 export type ReturnReason = 
 | 'damaged_item'
 | 'wrong_item'
 | 'missing_parts'
 | 'defective'
 | 'changed_mind'
 | 'late_delivery'
 | 'other';

export type ReturnStatus = 
 | 'requested'
 | 'pending_review'
 | 'approved'
 | 'rejected'
 | 'awaiting_shipment'
 | 'in_transit'
 | 'received'
 | 'inspected'
 | 'refunded'
 | 'completed';

export type RefundType = 'original_payment_method' | 'store_credit';
export type ReplacementType = 'exact_match' | 'alternative_variant' | 'none';
export type ShippingResponsibility = 'seller' | 'buyer' | 'marketplace';
export type InspectionResult = 'pending' | 'passed' | 'failed' | 'partial_damage';

export interface ReturnRequest {
 id: string;
 orderId: string;
 orderItemId: string;
 userId: string;
 reason: ReturnReason;
 status: ReturnStatus;
 requestedDate: string; // ISO Date String
 approvalDate?: string; // ISO Date String
 returnWindowDays: number;
 refundType: RefundType;
 replacementType: ReplacementType;
 shippingResponsibility: ShippingResponsibility;
 inspectionResult: InspectionResult;
}

export interface ReturnEvaluationContext {
 orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
 orderDeliveryDate?: string; // ISO Date String
 isDigitalProduct: boolean;
 hasActiveReturnForOrderItem: boolean;
 previousReturnStatus?: ReturnStatus; 
 currentTime?: string; // اختیاری، برای تست و زمان‌سنجی
}

export interface ReturnResult {
 isAllowed: boolean;
 status: ReturnStatus;
 reason: string;
 message: string;
 refundEligibility: boolean;
}