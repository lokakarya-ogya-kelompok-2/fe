import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { Achievement } from '../../achievement/model/achievement';

export interface EmpAchievement extends ResponseContentMeta {
  id: string;
  user_id: string;
  notes: string;
  achievement_id: Achievement;
  score: number;
  assessment_year: number;
}

export interface EmpAchievementRequest {
  user_id: string;
  notes: string;
  achievement_id: string;
  score: number;
  assessment_year: number;
}
