import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface TechnicalSKill extends ResponseContentMeta {
  id: string;
  technical_skill: string;
  enabled: boolean;
}

export interface TechnicalSKillRequest {
  technical_skill: string;
  enabled: boolean;
}
