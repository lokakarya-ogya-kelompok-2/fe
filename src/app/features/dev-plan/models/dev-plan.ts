import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface DevPlan extends ResponseContentMeta {
  id: string;
  plan: string;
  enabled: boolean;
}

export interface DevPlanRequest {
  plan: string;
  enabled: boolean;
}
