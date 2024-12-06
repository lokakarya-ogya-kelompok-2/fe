import { ResponseContentMeta } from '../../../../shared/models/response-content-meta';
import { AttitudeSkill } from '../../../attitude-skill/models/attitude-skill';
import { User } from '../../../users/models/user';

export interface EmpAttitudeSkill extends ResponseContentMeta {
  id: string;
  user: User;
  attitude_skill: AttitudeSkill;
  score: number;
  assessment_year: number;
}
export interface EmpAttitudeSkillRequest {
  id?: string;
  attitude_skill_id: string;
  score: number;
  assessment_year: number;
}
