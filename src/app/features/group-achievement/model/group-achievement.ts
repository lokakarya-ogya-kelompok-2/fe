import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { Achievement } from '../../achievement/model/achievement';

export interface GroupAchievement extends ResponseContentMeta {
  id: string;
  group_name: string;
  percentage: number;
  enabled: boolean;
  achievements: Achievement[];
}

export interface GroupAchievementRequest {
  group_name: string;
  percentage: number;
  enabled: boolean;
}
