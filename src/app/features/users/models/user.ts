import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';
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
  division?: Division;
  employee_status: number;
}

export interface UserReq {
  id: string;
  username: string;
  position: string;
  email: string;
  password: string;
  roles: string[];
  full_name: string;
  employee_status: number;
  join_date: Date;
  enabled: boolean;
  division_id: string;
}

export interface ChangePasswordReq {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface UserQueryParam extends QueryParam {
  username_contains?: string;
  name_contains?: string;
  position_contains?: string;
  email_contains?: string;
  min_join_date?: Date;
  max_join_date?: Date;
  employee_status?: number;
  division_name_contains?: string;
  enabled_only?: boolean;
  with_roles?: boolean;
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
