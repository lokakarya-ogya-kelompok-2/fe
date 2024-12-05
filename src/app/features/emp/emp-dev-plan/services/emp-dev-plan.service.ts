import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../../shared/models/response';
import { EmpDevPlan, EmpDevPlanRequest } from '../models/emp-dev-plan';

@Injectable({
  providedIn: 'root',
})
export class EmpDevPlanService {
  private Api = 'http://localhost:8080/emp-dev-plans';
  constructor(private http: HttpClient) {}

  getAllEmpDevPlans(): Observable<any> {
    return this.http.get<any>(this.Api);
  }
  createEmpDevPlan(): Observable<any> {
    return this.http.post<any>(this.Api, {});
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
