import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { Division } from '../../divisions/models/division';
import { Role } from '../../roles/models/role';

export interface User extends ResponseContentMeta {
  id: string;
  username: string;
  full_name: string;
  email_address: string;
  join_date: Date;
  position: string;
  enabled: boolean;
  password: string;
  roles: Role[];
  division: Division;
}
