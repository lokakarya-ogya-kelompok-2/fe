import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface GroupAttitudeSkill extends ResponseContentMeta {
  id: string;
  group_name: string;
  percentage: number;
  enabled: boolean;
}

export interface GroupAttitudeSkillRequest {
  group_name: string;
  percentage: number;
  enabled: boolean;
}
