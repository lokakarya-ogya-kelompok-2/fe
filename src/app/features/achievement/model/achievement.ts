import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { GroupAchievement } from '../../group-achievement/model/group-achievement';

export interface Achievement extends ResponseContentMeta {
  id: number;
  achievement: string;
  group_id: GroupAchievement;
  enabled: boolean;
}

export interface AchievementRequest {
  achievement: string;
  group_id: string;
  enabled: boolean;
}
