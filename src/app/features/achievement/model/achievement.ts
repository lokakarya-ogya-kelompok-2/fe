import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';
import { GroupAchievement } from '../../group-achievement/model/group-achievement';

export interface Achievement extends ResponseContentMeta {
  id: string;
  achievement: string;
  group_id: GroupAchievement;
  enabled: boolean;
}

export interface AchievementRequest {
  achievement: string;
  group_id: string;
  enabled: boolean;
}

export interface AchievementQueryParam extends QueryParam {
  any_contains?: string;
  name_contains?: string;
  enabled_only?: boolean;
  with_group?: boolean;
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
