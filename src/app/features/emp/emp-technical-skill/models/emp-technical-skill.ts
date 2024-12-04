import { ResponseContentMeta } from '../../../../shared/models/response-content-meta';
import { TechnicalSkill } from '../../../technical-skill/models/technical-skill';
import { User } from '../../../users/models/user';

export interface EmpTechnicalSkillReq {
  detail: string;
  technical_skill_id: string;
  score: number;
  assessment_year: number;
}

export interface EmpTechnicalSkill extends ResponseContentMeta {
  id: string;
  user: User;
  technical_skill: TechnicalSkill;
  score: number;
  assessment_year: number;
}