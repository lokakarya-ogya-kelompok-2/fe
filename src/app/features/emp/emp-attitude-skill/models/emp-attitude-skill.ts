import { ResponseContentMeta } from '../../../../shared/models/response-content-meta';

export interface EmpAttitudeSkill extends ResponseContentMeta {
  id: string;
  user_id: string;
  attitude_skill_id: string;
  score: number;
  assessment_year: number;
}
export interface EmpAttitudeSkillRequest {
  user_id: string;
  attitude_skill_id: string;
  score: number;
  assessment_year: number;
}
