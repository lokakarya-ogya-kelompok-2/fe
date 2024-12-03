import { User } from '../../features/users/models/user';

export interface ResponseContentMeta {
  created_at: Date;
  created_by?: User;
  updated_at?: Date;
  updated_by?: User;
}
