/**
 * Generic pagination and query options for the repository layer.
 */
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface QueryOptions extends PaginationOptions {
    where?: Record<string, any>;
    include?: string[];
  }
  
  /**
   * Base Repository Contract
   * Defines the standard CRUD operations for all entities.
   * Fully ORM-agnostic.
   */
  export interface BaseRepository<TEntity, TCreateDTO, TUpdateDTO> {
    /**
     * Retrieves an entity by its unique identifier.
     */
    findById(id: string): Promise<TEntity | null>;
  
    /**
     * Retrieves the first entity matching the given options.
     */
    findFirst(options?: QueryOptions): Promise<TEntity | null>;
  
    /**
     * Retrieves multiple entities matching the given options without pagination metadata.
     */
    findMany(options?: QueryOptions): Promise<TEntity[]>;
  
    /**
     * Retrieves a paginated list of entities.
     */
    paginate(options: PaginationOptions): Promise<PaginatedResult<TEntity>>;
  
    /**
     * Creates a new entity.
     */
    create(data: TCreateDTO): Promise<TEntity>;
  
    /**
     * Updates an existing entity by its identifier.
     */
    update(id: string, data: TUpdateDTO): Promise<TEntity>;
  
    /**
     * Deletes (or soft-deletes) an entity by its identifier.
     */
    delete(id: string): Promise<boolean>;
  
    /**
     * Checks if an entity exists by its identifier.
     */
    exists(id: string): Promise<boolean>;
  
    /**
     * Counts the total number of entities matching the options.
     */
    count(options?: QueryOptions): Promise<number>;
  }