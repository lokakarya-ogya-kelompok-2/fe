import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { GroupAchievement } from '../../group-achievement/model/group-achievement';

export interface AttitudeSkill extends ResponseContentMeta {
  id: number;
  attitude_skill: string;
  group_id: GroupAchievement;
  enabled: boolean;
}

export interface AttitudeSkillRequest {
  attitude_skill: string;
  group_id: string;
  enabled: boolean;
}
