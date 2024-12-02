import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { Menu } from '../../menus/models/menu';

export interface Role extends ResponseContentMeta {
  id: string;
  role_name: string;
  menus?: Menu[];
}
