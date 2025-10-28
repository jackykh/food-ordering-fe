// API Response Type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
