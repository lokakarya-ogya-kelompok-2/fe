import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface Role extends ResponseContentMeta {
  id: number;
  role_name: string;
}
