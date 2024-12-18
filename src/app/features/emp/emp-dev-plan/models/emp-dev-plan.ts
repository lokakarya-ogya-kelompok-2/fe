import { ResponseContentMeta } from '../../../../shared/models/response-content-meta';
import { QueryParam } from '../../../../shared/types';
import { DevPlan } from '../../../dev-plan/models/dev-plan';
import { User } from '../../../users/models/user';

export interface EmpDevPlan extends ResponseContentMeta {
  id: string;
  user_id: User;
  dev_plan: DevPlan;
  detail: string;
  assessment_year: number;
}

export interface EmpDevPlanRequest {
  id?: string;
  dev_plan_id: string;
  assessment_year: number;
  detail: string;
}

export interface EmpDevPlanQueryParam extends QueryParam {
  user_ids?: string[];
  years?: number[];
  with_created_by?: boolean;
  with_updated_by?: boolean;
  enabled_only?: boolean;
}
