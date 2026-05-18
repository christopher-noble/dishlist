/**
 * Shared Public API
 * 
 * Exports all shared utilities, types, and hooks
 */

// API
export { apiClient, ApiError } from './api/client';
export type { ApiResponse, RequestConfig } from './api/client';

// Types
export type {
  ApiResponse as SharedApiResponse,
  PaginationParams,
  PaginatedResponse,
  BaseEntity,
  Status,
  AsyncState,
} from './types';

