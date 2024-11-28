import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EmpAchievement,
  EmpAchievementRequest,
} from '../models/emp-achievement';

@Injectable({
  providedIn: 'root',
})
export class EmpAchievementService {
  private Api = 'http://localhost:8080/emp-achievement-skills';
  constructor(private http: HttpClient) {}
  getAllEmpAchievements(): Observable<any> {
    return this.http.get<any>(this.Api);
  }
  createEmpAchievement(
    empAchievement: EmpAchievementRequest
  ): Observable<EmpAchievement> {
    return this.http.post<EmpAchievement>(this.Api, empAchievement);
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
