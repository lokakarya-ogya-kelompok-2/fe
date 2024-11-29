import { JwtPayload } from 'jwt-decode';

export enum DialogType {
  ADD = 1,
  UPDATE = 2,
  DETAIL = 3,
}

export interface TokenPayload extends JwtPayload {
  username: string;
  full_name: string;
}
