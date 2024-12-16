import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';
import { AttitudeSkill } from '../../attitude-skill/models/attitude-skill';

export interface GroupAttitudeSkill extends ResponseContentMeta {
  id: string;
  group_name: string;
  percentage: number;
  attitude_skills?: AttitudeSkill[];
  enabled: boolean;
}

export interface GroupAttitudeSkillRequest {
  group_name: string;
  percentage: number;
  enabled: boolean;
}

export interface GroupAttitudeSkillQueryParam extends QueryParam {
  name_contains?: string;
  min_weight?: number;
  max_weight?: number;
  enabled_only?: boolean;
  with_attitude_skills?: boolean;
  with_enabled_child_only?: boolean;
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
