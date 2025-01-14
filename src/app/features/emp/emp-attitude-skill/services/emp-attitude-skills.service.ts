import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Response } from '../../../../shared/models/response';
import { toHttpParam } from '../../../../shared/utils/query-param';
import {
  EmpAttitudeSkill,
  EmpAttitudeSkillQueryParam,
  EmpAttitudeSkillRequest,
} from '../models/emp-attitude-skill';

@Injectable({
  providedIn: 'root',
})
export class EmpAttitudeSkillsService {
  private Api = `${environment.baseApiURL}/emp-attitude-skills`;
  constructor(private httpClient: HttpClient) {}

  getEmpAttitudeSkill(
    param: EmpAttitudeSkillQueryParam = {}
  ): Observable<Response<EmpAttitudeSkill[]>> {
    const params = toHttpParam(param);
    return this.httpClient.get<Response<EmpAttitudeSkill[]>>(this.Api, {
      params,
    });
  }

  createEmpAttitudeSkill(
    empAttitudeSkillRequest: EmpAttitudeSkillRequest[]
  ): Observable<EmpAttitudeSkill[]> {
    return this.httpClient.post<EmpAttitudeSkill[]>(
      `${this.Api}/bulk-create`,
      empAttitudeSkillRequest
    );
  }

  update(
    data: EmpAttitudeSkillRequest
  ): Observable<Response<EmpAttitudeSkill>> {
    return this.httpClient.put<Response<EmpAttitudeSkill>>(
      `${this.Api}/${data.id}`,
      data
    );
  }
}
