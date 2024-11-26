import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface DevPlan extends ResponseContentMeta {
  id: string;
  plan: string;
}

export interface DevPlanRequest {
  plan: string;
}
