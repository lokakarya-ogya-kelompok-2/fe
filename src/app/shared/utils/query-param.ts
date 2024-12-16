import { HttpParams } from '@angular/common/http';
import { QueryParam } from '../types';

export const toHttpParam = <T extends QueryParam>(param: T) => {
  let params = new HttpParams();
  Object.keys(param).forEach((key) => {
    if (param[key] !== undefined && param[key] !== null) {
      params = params.set(key, param[key].toString());
    }
  });
  return params;
};
