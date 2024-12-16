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

export interface Status {
  label: string;
  value: boolean;
  severity: string;
}

export interface QueryParam {
  [key: string]:
    | string
    | boolean
    | number
    | undefined
    | Date
    | string[]
    | number[];
}
