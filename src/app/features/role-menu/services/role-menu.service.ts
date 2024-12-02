import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';

@Injectable({
  providedIn: 'root',
})
export class RoleMenuService {
  private readonly baseMenuRoleUrl = `${environment.baseApiURL}/role-menu`;
  constructor(private readonly httpClient: HttpClient) {}

  update(data: Map<string, string[]>): Observable<Response<void>> {
    return this.httpClient.put<Response<void>>(
      this.baseMenuRoleUrl,
      Object.fromEntries(data)
    );
  }
}
