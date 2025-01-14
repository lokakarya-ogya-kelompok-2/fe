import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';

export interface EmpSuggestion extends ResponseContentMeta {
  id: string;
  user_id: string;
  suggestion: string;
  assessment_year: number;
}
export interface EmpSuggestionRequest {
  id?: string;
  user_id: string;
  suggestion: string;
  assessment_year: number;
}

export interface EmpSuggestionQueryParam extends QueryParam {
  user_ids?: string[];
  years?: number[];
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
