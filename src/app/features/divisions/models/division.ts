import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface Division extends ResponseContentMeta {
  id: string;
  division_name: string;
}

export interface DivisionRequest {
  division_name: string;
}
