import { ResponseContentMeta } from '../../../shared/models/response-content-meta';

export interface Role extends ResponseContentMeta {
  id: string;
  role_name: string;
}
