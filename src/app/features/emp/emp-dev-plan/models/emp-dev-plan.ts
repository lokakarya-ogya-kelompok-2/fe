import { ResponseContentMeta } from '../../../../shared/models/response-content-meta';

export interface EmpDevPlan extends ResponseContentMeta {
  id: string;
  user_id: string;
  dev_plan_id: string;
  assessment_year: number;
}

export interface EmpDevPlanRequest {
  user_id: string;
  dev_plan_id: string;
  assessment_year: number;
}
