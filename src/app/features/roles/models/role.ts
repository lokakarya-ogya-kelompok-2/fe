import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { QueryParam } from '../../../shared/types';
import { Menu } from '../../menus/models/menu';

export interface Role extends ResponseContentMeta {
  id: string;
  role_name: string;
  menus?: Menu[];
}

export interface RoleQueryParam extends QueryParam {
  name_contains?: string;
  with_menus?: boolean;
  with_created_by?: boolean;
  with_updated_by?: boolean;
}
