import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Response } from '../../../../shared/models/response';
import { toHttpParam } from '../../../../shared/utils/query-param';
import {
  EmpDevPlan,
  EmpDevPlanQueryParam,
  EmpDevPlanRequest,
} from '../models/emp-dev-plan';

@Injectable({
  providedIn: 'root',
})
export class EmpDevPlanService {
  private Api = `${environment.baseApiURL}/emp-dev-plans`;
  constructor(private http: HttpClient) {}

  getAllEmpDevPlans(
    param: EmpDevPlanQueryParam = {}
  ): Observable<Response<EmpDevPlan[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<EmpDevPlan[]>>(this.Api, { params });
  }
  createEmpDevPlan(data: EmpDevPlanRequest): Observable<Response<EmpDevPlan>> {
    return this.http.post<Response<EmpDevPlan>>(this.Api, data);
  }

  insertBulk(data: EmpDevPlanRequest[]): Observable<Response<EmpDevPlan[]>> {
    return this.http.post<Response<EmpDevPlan[]>>(
      `${this.Api}/bulk-create`,
      data
    );
  }

  getByUserIdAndYear(
    userId: string,
    year: number
  ): Observable<Response<EmpDevPlan[]>> {
    return this.http.get<Response<EmpDevPlan[]>>(
      `${this.Api}?user_ids=${userId}&years=${year}`
    );
  }
}
