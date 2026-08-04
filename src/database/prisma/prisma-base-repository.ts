import { 
    BaseRepository, 
    PaginatedResult, 
    PaginationOptions, 
    QueryOptions 
  } from '../repositories/base-repository';
  
  /**
   * A generic interface describing the standard methods available on Prisma model delegates.
   * This allows us to pass ANY Prisma model (e.g., prisma.user, prisma.order) to the base repository.
   */
  export interface PrismaDelegate {
    findUnique(args: any): Promise<any>;
    findFirst(args: any): Promise<any>;
    findMany(args: any): Promise<any>;
    create(args: any): Promise<any>;
    update(args: any): Promise<any>;
    delete(args: any): Promise<any>;
    count(args?: any): Promise<number>;
  }
  
  /**
   * Abstract implementation of the BaseRepository using Prisma.
   * Entity-specific repositories will extend this class and pass their specific Prisma model.
   */
  export class PrismaBaseRepository<TEntity, TCreateDTO, TUpdateDTO>
    implements BaseRepository<TEntity, TCreateDTO, TUpdateDTO>
  {
    constructor(protected readonly model: PrismaDelegate) {}
  
    async findById(id: string): Promise<TEntity | null> {
      return this.model.findUnique({
        where: { id },
      });
    }
  
    async findFirst(options?: QueryOptions): Promise<TEntity | null> {
      return this.model.findFirst({
        where: options?.where,
        include: this.buildInclude(options?.include),
        orderBy: this.buildOrderBy(options),
      });
    }
  
    async findMany(options?: QueryOptions): Promise<TEntity[]> {
      return this.model.findMany({
        where: options?.where,
        include: this.buildInclude(options?.include),
        orderBy: this.buildOrderBy(options),
        skip: options?.page && options?.limit ? (options.page - 1) * options.limit : undefined,
        take: options?.limit,
      });
    }
  
    async paginate(options: PaginationOptions): Promise<PaginatedResult<TEntity>> {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;
      
      // Typecast to QueryOptions to safely pass 'where' if it's provided by extended classes
      const queryOptions = options as QueryOptions;
  
      const [total, data] = await Promise.all([
        this.model.count({ where: queryOptions.where }),
        this.model.findMany({
          where: queryOptions.where,
          include: this.buildInclude(queryOptions.include),
          orderBy: this.buildOrderBy(options),
          skip,
          take: limit,
        }),
      ]);
  
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }
  
    async create(data: TCreateDTO): Promise<TEntity> {
      return this.model.create({
        data,
      });
    }
  
    async update(id: string, data: TUpdateDTO): Promise<TEntity> {
      return this.model.update({
        where: { id },
        data,
      });
    }
  
    async delete(id: string): Promise<boolean> {
      try {
        await this.model.delete({
          where: { id },
        });
        return true;
      } catch (error) {
        // Prisma throws an error if the record to delete doesn't exist.
        return false;
      }
    }
  
    async exists(id: string): Promise<boolean> {
      const count = await this.model.count({
        where: { id },
      });
      return count > 0;
    }
  
    async count(options?: QueryOptions): Promise<number> {
      return this.model.count({
        where: options?.where,
      });
    }
  
    // --- Helper Methods ---
  
    /**
     * Converts a string array of relations to Prisma's 'include' object format.
     */
    protected buildInclude(includes?: string[]): Record<string, boolean> | undefined {
      if (!includes || includes.length === 0) return undefined;
      return includes.reduce((acc, curr) => ({ ...acc, [curr]: true }), {});
    }
  
    /**
     * Converts pagination options to Prisma's 'orderBy' object format.
     */
    protected buildOrderBy(options?: PaginationOptions): Record<string, 'asc' | 'desc'> | undefined {
      if (!options?.sortBy) return undefined;
      return { [options.sortBy]: options.sortOrder || 'asc' };
    }
  }