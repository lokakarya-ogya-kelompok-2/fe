import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import { Role, RoleQueryParam } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly baseRoleUrl = environment.baseApiURL + '/roles';
  constructor(private readonly httpClient: HttpClient) {}

  list(param: RoleQueryParam = {}): Observable<Response<Role[]>> {
    const params = toHttpParam(param);
    return this.httpClient.get<Response<Role[]>>(this.baseRoleUrl, { params });
  }
}
