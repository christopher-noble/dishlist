/**
 * API Client Configuration
 * 
 * Centralized API client setup with interceptors, error handling,
 * and request/response transformation.
 */

type RequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
};

type ApiResponse<T> = {
  data: T;
  status: number;
  statusText: string;
};

type UnknownApiResponse = {
  data: unknown;
  status: number;
  statusText: string;
};

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = process.env.EXPO_PUBLIC_API_URL || '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  /**
   * Set default headers
   */
  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params: Record<string, string | number | boolean>): string {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
    return queryParams.toString();
  }

  /**
   * Make API request
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const response = await this.requestUnknown(endpoint, config);
    const typedResponse: ApiResponse<T> = {
      status: response.status,
      statusText: response.statusText,
      data: response.data as T,
    };
    return typedResponse;
  }

  private async requestUnknown(endpoint: string, config: RequestConfig = {}): Promise<UnknownApiResponse> {
    const { method = 'GET', headers = {}, body, params } = config;

    // Build URL with query params
    let url = `${this.baseURL}${endpoint}`;
    if (params && Object.keys(params).length > 0) {
      const queryString = this.buildQueryString(params);
      url += `?${queryString}`;
    }

    // Merge headers
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const jsonData: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = 
          typeof jsonData === 'object' && 
          jsonData !== null && 
          'message' in jsonData && 
          typeof jsonData.message === 'string'
            ? jsonData.message
            : 'An error occurred';
        throw new ApiError(
          errorMessage,
          response.status,
          jsonData
        );
      }

      return {
        data: jsonData,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        error
      );
    }
  }

  /**
   * Convenience methods
   */
  get<T>(endpoint: string, params?: Record<string, string | number | boolean>) {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export type for use in features
export type { ApiResponse, RequestConfig };
