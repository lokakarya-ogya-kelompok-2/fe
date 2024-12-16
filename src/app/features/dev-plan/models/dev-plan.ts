import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';

export interface DevPlan extends ResponseContentMeta {
  id: string;
  plan: string;
  enabled: boolean;
}

export interface DevPlanRequest {
  plan: string;
  enabled: boolean;
}

export interface DevPlanQueryParam extends QueryParam {
  name_contains?: string;
  enabled_only?: boolean;
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
