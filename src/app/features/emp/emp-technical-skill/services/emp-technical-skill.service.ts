import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Response } from '../../../../shared/models/response';
import { toHttpParam } from '../../../../shared/utils/query-param';
import {
  EmpTechnicalSkill,
  EmpTechnicalSkillQueryParam,
  EmpTechnicalSkillReq,
} from '../models/emp-technical-skill';

@Injectable({
  providedIn: 'root',
})
export class EmpTechnicalSkillService {
  private readonly baseApiUrl = `${environment.baseApiURL}/emp-technical-skills`;

  constructor(private readonly httpClient: HttpClient) {}

  insert(data: EmpTechnicalSkillReq): Observable<Response<EmpTechnicalSkill>> {
    return this.httpClient.post<Response<EmpTechnicalSkill>>(
      `${this.baseApiUrl}`,
      data
    );
  }

  insertBulk(
    data: EmpTechnicalSkillReq[]
  ): Observable<Response<EmpTechnicalSkill[]>> {
    return this.httpClient.post<Response<EmpTechnicalSkill[]>>(
      `${this.baseApiUrl}/bulk-create`,
      data
    );
  }

  delete(id: string): Observable<Response<void>> {
    return this.httpClient.delete<Response<void>>(`${this.baseApiUrl}/${id}`);
  }

  list(
    param: EmpTechnicalSkillQueryParam
  ): Observable<Response<EmpTechnicalSkill[]>> {
    const params = toHttpParam(param);
    return this.httpClient.get<Response<EmpTechnicalSkill[]>>(this.baseApiUrl, {
      params,
    });
  }
}
