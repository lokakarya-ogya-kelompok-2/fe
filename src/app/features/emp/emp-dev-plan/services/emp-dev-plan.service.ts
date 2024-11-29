import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
