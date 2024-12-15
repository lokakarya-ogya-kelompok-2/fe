import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import {
  TechnicalSkill,
  TechnicalSkillQueryParam,
  TechnicalSKillRequest,
} from '../models/technical-skill';

@Injectable({
  providedIn: 'root',
})
export class TechnicalSkillService {
  private technicalSkillApiUrl = `${environment.baseApiURL}/technical-skills`;
  constructor(private http: HttpClient) {}

  getAllTechnicalSkills(
    param: TechnicalSkillQueryParam = {}
  ): Observable<Response<TechnicalSkill[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<TechnicalSkill[]>>(
      this.technicalSkillApiUrl,
      { params }
    );
  }
  createTechnicalSkill(
    technicalSkillRequest: TechnicalSKillRequest
  ): Observable<TechnicalSkill> {
    return this.http.post<TechnicalSkill>(
      this.technicalSkillApiUrl,
      technicalSkillRequest
    );
  }
  updateTechnicalSkill(
    technicalSkill: TechnicalSkill
  ): Observable<TechnicalSkill> {
    return this.http.put<TechnicalSkill>(
      `${this.technicalSkillApiUrl}/${technicalSkill.id}`,
      technicalSkill
    );
  }
  deleteTechnicalSkill(id: string): Observable<any> {
    return this.http.delete(`${this.technicalSkillApiUrl}/${id}`);
  }
}
