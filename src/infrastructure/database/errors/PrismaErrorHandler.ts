import { RecordNotFoundException, UniqueConstraintException, DomainException } from './DatabaseErrors';

export class PrismaErrorHandler {
  public static handle(error: any, entityName: string): never {
    if (error.code === 'P2025') {
      throw new RecordNotFoundException(entityName, 'unknown');
    }
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'unknown field';
      throw new UniqueConstraintException(field);
    }
    // Timeout or Connection Failure
    if (error.code === 'P1001' || error.code === 'P1008') {
      throw new DomainException('Database connection timeout or failure.', 'DB_CONNECTION_ERROR');
    }
    
    // Fallback for unknown DB errors
    throw new DomainException(`Unexpected database error: ${error.message}`, 'INTERNAL_DB_ERROR');
  }
}