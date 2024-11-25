import { User } from '../../../users/models/user';

export interface LoginRequest {
  email_or_username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
