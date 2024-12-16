import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';

export interface TechnicalSkill extends ResponseContentMeta {
  id: string;
  technical_skill: string;
  enabled: boolean;
}

export interface TechnicalSKillRequest {
  technical_skill: string;
  enabled: boolean;
}

export interface TechnicalSkillQueryParam extends QueryParam {
  name_contains?: string;
  enabled_only?: boolean;
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
