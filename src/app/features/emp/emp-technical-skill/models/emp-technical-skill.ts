import { ResponseContentMeta } from '../../../../shared/models/response-content-meta';
import { QueryParam } from '../../../../shared/types';
import { TechnicalSkill } from '../../../technical-skill/models/technical-skill';
import { User } from '../../../users/models/user';

export interface EmpTechnicalSkillReq {
  id?: string;
  detail: string;
  technical_skill_id: string;
  score: number;
  assessment_year: number;
}

export interface EmpTechnicalSkill extends ResponseContentMeta {
  id: string;
  user: User;
  technical_skill: TechnicalSkill;
  detail: string;
  score: number;
  assessment_year: number;
}

export interface EmpTechnicalSkillQueryParam extends QueryParam {
  user_ids?: string[];
  years?: number[];
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
