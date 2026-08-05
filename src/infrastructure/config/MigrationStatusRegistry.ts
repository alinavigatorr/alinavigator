export enum MigrationState {
    MOCK = 'MOCK',
    PARTIAL = 'PARTIAL',
    PRODUCTION = 'PRODUCTION'
  }
  
  export class MigrationStatusRegistry {
    private static statuses: Map<string, MigrationState> = new Map();
  
    public static track(moduleName: string, state: MigrationState): void {
      this.statuses.set(moduleName, state);
    }
  
    public static getStatus(moduleName: string): MigrationState {
      return this.statuses.get(moduleName) || MigrationState.MOCK;
    }
  
    public static printReport(): void {
      console.table(Array.from(this.statuses.entries()).map(([module, state]) => ({
        Module: module,
        State: state
      })));
    }
  }