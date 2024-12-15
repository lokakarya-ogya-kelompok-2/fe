import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';
import { GroupAchievement } from '../../group-achievement/model/group-achievement';

export interface AttitudeSkill extends ResponseContentMeta {
  id: string;
  attitude_skill: string;
  group_id: GroupAchievement;
  enabled: boolean;
}

export interface AttitudeSkillRequest {
  attitude_skill: string;
  group_id: string;
  enabled: boolean;
}

export interface AttitudeSkillQueryParam extends QueryParam {
  name_contains?: string;
  enabled_only?: boolean;
  with_group?: boolean;
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
