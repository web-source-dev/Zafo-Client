import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import authService from '../services/auth-service';

// API base URL from environment or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Define generic types for API data
export type ApiData = Record<string, unknown>;

// API error response data interface
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

// API response interface
export interface ApiResponse<T = ApiData> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Create axios instance with base URL
const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      authService.logout();
      // Redirect to login if in browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API class with methods for making requests
class Api {
  /**
   * Make a GET request
   * @param url API endpoint
   * @param config Optional axios config
   * @returns Promise with response data
   */
  async get<T = ApiData>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await apiInstance.get(url, config);
      return this.formatResponse<T>(response);
    } catch (error: unknown) {
      return this.formatError<T>(error);
    }
  }

  /**
   * Make a POST request
   * @param url API endpoint
   * @param data Request payload
   * @param config Optional axios config
   * @returns Promise with response data
   */
  async post<T = ApiData>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await apiInstance.post(url, data, config);
      return this.formatResponse<T>(response);
    } catch (error: unknown) {
      return this.formatError<T>(error);
    }
  }

  /**
   * Make a PUT request
   * @param url API endpoint
   * @param data Request payload
   * @param config Optional axios config
   * @returns Promise with response data
   */
  async put<T = ApiData>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await apiInstance.put(url, data, config);
      return this.formatResponse<T>(response);
    } catch (error: unknown) {
      return this.formatError<T>(error);
    }
  }

  /**
   * Make a DELETE request
   * @param url API endpoint
   * @param config Optional axios config
   * @returns Promise with response data
   */
  async delete<T = ApiData>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await apiInstance.delete(url, config);
      return this.formatResponse<T>(response);
    } catch (error: unknown) {
      return this.formatError<T>(error);
    }
  }

  /**
   * Make a PATCH request
   * @param url API endpoint
   * @param data Request payload
   * @param config Optional axios config
   * @returns Promise with response data
   */
  async patch<T = ApiData>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await apiInstance.patch(url, data, config);
      return this.formatResponse<T>(response);
    } catch (error: unknown) {
      return this.formatError<T>(error);
    }
  }

  /**
   * Format successful API response
   * @param response Axios response
   * @returns Formatted API response
   */
  private formatResponse<T>(response: AxiosResponse): ApiResponse<T> {
    const data = response.data;
    
    return {
      success: data.success !== undefined ? data.success : true,
      message: data.message,
      data: data.data || data,
      error: data.error
    };
  }

  /**
   * Format API error response
   * @param error Axios error
   * @returns Formatted API error response
   */
  private formatError<T>(error: unknown): ApiResponse<T> {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as ApiErrorResponse | undefined;
      
      return {
        success: false,
        message: responseData?.message || 'An error occurred',
        error: responseData?.error || error.message
      };
    }
    
    return {
      success: false,
      message: 'An unknown error occurred',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Export as singleton instance
export const api = new Api();
export default api;
