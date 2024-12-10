import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface EmpSuggestion extends ResponseContentMeta {
  id: string;
  user_id: string;
  suggestion: string;
  assessment_year: number;
}
export interface EmpSuggestionRequest {
  user_id: string;
  suggestion: string;
  assessment_year: number;
}
