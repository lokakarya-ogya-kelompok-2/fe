import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface Achievement extends ResponseContentMeta {
  id: number;
  achievement: string;
  group_id: string;
  enabled: boolean;
}

export interface AchievementRequest {
  achievement: string;
  group_id: string;
  enabled: boolean;
}
