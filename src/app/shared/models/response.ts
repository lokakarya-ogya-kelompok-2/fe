export interface Response<T> {
  success: boolean;
  time_taken: string;
  timestamp: number;
  content: T;
  message: string;
  page_number: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}
