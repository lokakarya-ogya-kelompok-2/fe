import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';
import { User } from '../../users/models/user';

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
export interface SummaryItem {
  aspect: string;
  score: number;
  weight: number;
  items: []; //maap masi bingung tipe datanya
  final_score: number;
}

export interface Summary extends ResponseContentMeta {
  id: string;
  user_id: User;
  score: number;
  status: number;
  year: number;
  approval_status: number;
  achievements?: SummaryItem[];
  attitude_skills?: SummaryItem[];
}

export interface SummaryQueryParam extends QueryParam {
  any_contains?: string;
  user_ids?: string[];
  division_ids?: string[];
  years?: number[];
  with_created_by?: boolean;
  with_updated_by?: boolean;
  approval_status?: number;
}

export interface EmpAchievementFormData {
  score: number;
  notes: string;
}
