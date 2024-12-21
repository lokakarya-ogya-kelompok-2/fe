import { JwtPayload } from 'jwt-decode';

export enum DialogType {
  ADD = 1,
  UPDATE = 2,
  DETAIL = 3,
  CHANGE_PASSWORD = 4,
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

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
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
  page_number?: number;
  page_size?: number;
  sort_column?: string;
  sort_mode?: Direction;
}
