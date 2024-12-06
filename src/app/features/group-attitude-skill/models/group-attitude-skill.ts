import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
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
