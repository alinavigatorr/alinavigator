import { EntityId } from './database-types';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Repository<TEntity, TCreateInput, TUpdateInput> {
  findById(id: EntityId): Promise<TEntity | null>;
  
  findMany(options?: PaginationOptions): Promise<PaginatedResult<TEntity>>;
  
  create(data: TCreateInput): Promise<TEntity>;
  
  update(id: EntityId, data: TUpdateInput): Promise<TEntity>;
  
  delete(id: EntityId): Promise<boolean>;
  
  exists(id: EntityId): Promise<boolean>;
  
  count(): Promise<number>;
}