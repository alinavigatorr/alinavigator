/**
 * Standardized primitive types and mixins for database entities.
 */

export type EntityId = string;

export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDelete {
  deletedAt: Date | null;
  isDeleted: boolean;
}

export interface AuditFields {
  createdBy?: EntityId | null;
  updatedBy?: EntityId | null;
}

export interface VersionField {
  version: number; // For optimistic locking
}

export type BaseEntityFields = Timestamp & SoftDelete & AuditFields & VersionField;