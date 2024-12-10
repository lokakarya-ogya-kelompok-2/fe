import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
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
  finalScore: number;
}

export interface Summary extends ResponseContentMeta {
  id: string;
  user_id: User;
  score: number;
  status: number;
  year: number;
}

export interface SummaryData {
  attitudeSkillSummary: SummaryItem[];
  achievementSummary: SummaryItem[];
  totalPercentage: number;
  totalScore: number;
}
