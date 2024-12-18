import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import {
  AttitudeSkill,
  AttitudeSkillQueryParam,
  AttitudeSkillRequest,
} from '../models/attitude-skill';
@Injectable({
  providedIn: 'root',
})
export class AttitudeSkillService {
  private attitudeSkillApiUrl = `${environment.baseApiURL}/attitude-skills`;
  constructor(private http: HttpClient) {}

  getAttitudeSkills(
    param: AttitudeSkillQueryParam = {}
  ): Observable<Response<AttitudeSkill[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<AttitudeSkill[]>>(this.attitudeSkillApiUrl, {
      params,
    });
  }
  createAttitudeSkill(
    attitudeSkill: AttitudeSkillRequest
  ): Observable<AttitudeSkill> {
    return this.http.post<AttitudeSkill>(
      this.attitudeSkillApiUrl,
      attitudeSkill
    );
  }
  updateAttitudeSkill(attitudeSkill: AttitudeSkill): Observable<AttitudeSkill> {
    return this.http.put<AttitudeSkill>(
      `${this.attitudeSkillApiUrl}/${attitudeSkill.id}`,
      attitudeSkill
    );
  }
  deleteAttitudeSkill(id: string): Observable<any> {
    return this.http.delete(`${this.attitudeSkillApiUrl}/${id}`);
  }
}
