import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import {
  EmpAchievement,
  EmpAchievementQueryParam,
  EmpAchievementRequest,
} from '../models/emp-achievement';

@Injectable({
  providedIn: 'root',
})
export class EmpAchievementService {
  private Api = `${environment.baseApiURL}/emp-achievement-skills`;
  constructor(private http: HttpClient) {}
  getAllEmpAchievements(
    param: EmpAchievementQueryParam
  ): Observable<Response<EmpAchievement[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<EmpAchievement[]>>(this.Api, { params });
  }

  createEmpAchievement(
    data: EmpAchievementRequest
  ): Observable<Response<EmpAchievement>> {
    return this.http.post<Response<EmpAchievement>>(this.Api, data);
  }

  bulkCreateEmpAchievement(
    data: EmpAchievementRequest[]
  ): Observable<Response<EmpAchievement[]>> {
    return this.http.post<Response<EmpAchievement[]>>(
      `${this.Api}/bulk-create`,
      data
    );
  }

  updateEmpAchievement(
    data: EmpAchievementRequest
  ): Observable<Response<EmpAchievement>> {
    return this.http.put<Response<EmpAchievement>>(
      `${this.Api}/${data.id}`,
      data
    );
  }

  deleteEmpAchievement(id: string): Observable<Response<void>> {
    return this.http.delete<Response<void>>(`${this.Api}/${id}`);
  }
}
