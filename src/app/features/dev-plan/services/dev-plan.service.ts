import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { DevPlan, DevPlanRequest } from '../models/dev-plan';

@Injectable({
  providedIn: 'root',
})
export class DevPlanService {
  private Api = `${environment.baseApiURL}/dev-plans`;
  constructor(private http: HttpClient) {}

  getAllDevPlan(): Observable<Response<DevPlan[]>> {
    return this.http.get<Response<DevPlan[]>>(this.Api);
  }
  createDevPlan(devPlanRequest: DevPlanRequest): Observable<DevPlan> {
    return this.http.post<DevPlan>(this.Api, devPlanRequest);
  }
  updateDevPlan(devPlan: DevPlan): Observable<DevPlan> {
    return this.http.put<DevPlan>(`${this.Api}/${devPlan.id}`, devPlan);
  }
  deleteDevPlan(id: string): Observable<any> {
    return this.http.delete(`${this.Api}/${id}`);
  }
}
