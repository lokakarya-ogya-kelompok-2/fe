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
    empAchievement: EmpAchievementRequest[]
  ): Observable<EmpAchievement[]> {
    return this.http.post<EmpAchievement[]>(
      `${this.Api}/bulk-create`,
      empAchievement
    );
  }
  updateEmpAchievement(
    empAchievement: EmpAchievement
  ): Observable<EmpAchievement> {
    return this.http.put<EmpAchievement>(
      `${this.Api}/${empAchievement.id}`,
      empAchievement
    );
  }
  deleteEmpAchievement(id: string): Observable<any> {
    return this.http.delete<any>(`${this.Api}/${id}`);
  }
}
