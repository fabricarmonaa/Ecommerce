declare module "mysql2/promise" {
  export interface PoolOptions {
    uri?: string;
    host?: string;
    user?: string;
    password?: string;
    database?: string;
    waitForConnections?: boolean;
    connectionLimit?: number;
    namedPlaceholders?: boolean;
  }

  export interface Pool {
    execute<T = any>(sql: string, values?: any[]): Promise<[T, any]>;
    query<T = any>(sql: string, values?: any[]): Promise<[T, any]>;
    end(): Promise<void>;
  }

  export function createPool(options: PoolOptions): Pool;

  const promise: {
    createPool: typeof createPool;
  };

  export default promise;
}
