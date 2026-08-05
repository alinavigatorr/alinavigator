export class DomainException extends Error {
    constructor(message: string, public code: string) {
      super(message);
      this.name = this.constructor.name;
    }
  }
  
  export class RecordNotFoundException extends DomainException {
    constructor(entity: string, id: string) {
      super(`${entity} with id ${id} not found.`, 'NOT_FOUND');
    }
  }
  
  export class UniqueConstraintException extends DomainException {
    constructor(field: string) {
      super(`Unique constraint failed on field: ${field}`, 'UNIQUE_VIOLATION');
    }
  }