import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly rolePath = environment.baseApiURL + '/roles';
  constructor(private readonly httpClient: HttpClient) {}

  list(): Observable<Response<Role[]>> {
    return this.httpClient.get<Response<Role[]>>(this.rolePath);
  }
}
