import { EntityId, BaseEntityFields } from './database-types';
import { UserRole } from '../domain/auth/role-types';
import { UserStatus } from '../domain/auth/user-types';

export enum EntityName {
  USER = 'User',
  SELLER = 'Seller',
  PRODUCT = 'Product',
  CATEGORY = 'Category',
  ORDER = 'Order',
  ORDER_ITEM = 'OrderItem',
  WALLET = 'Wallet',
  WALLET_TRANSACTION = 'WalletTransaction',
  REVIEW = 'Review',
  COUPON = 'Coupon',
  CAMPAIGN = 'Campaign',
  RETURN_REQUEST = 'ReturnRequest',
  NOTIFICATION = 'Notification',
  SESSION = 'Session',
  PERMISSION = 'Permission',
  ROLE = 'Role',
}

// --- Entity Interfaces Registry ---

export interface DbUser extends BaseEntityFields {
  id: EntityId;
  email: string;
  passwordHash: string;
  status: UserStatus;
}

export interface DbSeller extends BaseEntityFields {
  id: EntityId;
  userId: EntityId;
  storeName: string;
  isVerified: boolean;
}

export interface DbProduct extends BaseEntityFields {
  id: EntityId;
  sellerId: EntityId;
  categoryId: EntityId;
  title: string;
  slug: string;
  price: number;
  stock: number;
}

export interface DbCategory extends BaseEntityFields {
  id: EntityId;
  name: string;
  slug: string;
  parentId?: EntityId | null;
}

export interface DbOrder extends BaseEntityFields {
  id: EntityId;
  userId: EntityId;
  totalAmount: number;
  status: string;
}

export interface DbOrderItem extends BaseEntityFields {
  id: EntityId;
  orderId: EntityId;
  productId: EntityId;
  quantity: number;
  unitPrice: number;
}

export interface DbWallet extends BaseEntityFields {
  id: EntityId;
  userId: EntityId;
  balance: number;
  currency: string;
}

export interface DbWalletTransaction extends BaseEntityFields {
  id: EntityId;
  walletId: EntityId;
  amount: number;
  type: string;
}

export interface DbReview extends BaseEntityFields {
  id: EntityId;
  userId: EntityId;
  productId: EntityId;
  rating: number;
  comment?: string;
}

export interface DbCoupon extends BaseEntityFields {
  id: EntityId;
  code: string;
  discountPercent: number;
  expiresAt: Date;
}

export interface DbCampaign extends BaseEntityFields {
  id: EntityId;
  title: string;
  startDate: Date;
  endDate: Date;
}

export interface DbReturnRequest extends BaseEntityFields {
  id: EntityId;
  orderId: EntityId;
  reason: string;
  status: string;
}

export interface DbNotification extends BaseEntityFields {
  id: EntityId;
  userId: EntityId;
  title: string;
  message: string;
  isRead: boolean;
}

export interface DbSession extends BaseEntityFields {
  id: EntityId;
  userId: EntityId;
  tokenHash: string;
  expiresAt: Date;
}

export interface DbPermission extends BaseEntityFields {
  id: EntityId;
  code: string;
  name: string;
}

export interface DbRole extends BaseEntityFields {
  id: EntityId;
  name: UserRole;
  description?: string;
}