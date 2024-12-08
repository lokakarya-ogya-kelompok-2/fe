import { ResponseContentMeta } from '../../../shared/models/response-content-meta';
import { User } from '../../users/models/user';
export interface Summary extends ResponseContentMeta {
  id: string;
  user_id: User;
  score: number;
  status: number;
  year: number;
}
