/**
 * Shared Types
 * 
 * Common types used across the application
 */

/**
 * Generic API response wrapper
 */
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

/**
 * Pagination types
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

/**
 * Common entity fields
 */
export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Status types
 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

export type AsyncState<T> = {
  data: T | null;
  status: Status;
  error: string | null;
};
