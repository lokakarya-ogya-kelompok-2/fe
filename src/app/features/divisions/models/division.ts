import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';

export interface Division extends ResponseContentMeta {
  id: string;
  division_name: string;
}

export interface DivisionRequest {
  division_name: string;
}

export interface DivisionQueryParam extends QueryParam {
  page_number?: number;
  page_size?: number;
  name_contains?: string;
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
