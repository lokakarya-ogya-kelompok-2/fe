export interface Response<T> {
  success: boolean;
  time_taken: string;
  timestamp: number;
  content: T;
  message: string;
}
