import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface GroupAchievement extends ResponseContentMeta {
  id: string;
  group_name: string;
  percentage: number;
  enabled: boolean;
}

export interface GroupAchievementRequest {
  group_name: string;
  percentage: number;
  enabled: boolean;
}
