import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';
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

export interface GroupAchievementQueryParam extends QueryParam {
  name_contains?: string;
  min_weight?: number;
  max_weight?: number;
  enabled_only?: boolean;
  with_achievements?: boolean;
  with_enabled_child_only?: boolean;
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
