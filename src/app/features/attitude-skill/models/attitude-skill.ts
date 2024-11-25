import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface AttitudeSkill extends ResponseContentMeta {
  id: number;
  attitude_skill: string;
  group_id: string;
  enabled: boolean;
}

export interface AttitudeSkillRequest {
  attitude_skill: string;
  group_id: string;
  enabled: boolean;
}
