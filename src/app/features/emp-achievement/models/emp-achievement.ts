import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { Achievement } from '../../achievement/model/achievement';
import { User } from '../../users/models/user';

export interface EmpAchievement extends ResponseContentMeta {
  id: string;
  user_id: User;
  notes: string;
  achievement_id: Achievement;
  score: number;
  assessment_year: number;
}

export interface EmpAchievementRequest {
  id?: string;
  user_id: string;
  notes: string;
  achievement_id: string;
  score: number;
  assessment_year: number;
}
