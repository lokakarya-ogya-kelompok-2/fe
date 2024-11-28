import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpAchievementService {
  private Api = 'http://localhost:8080/emp-achievement-skills';
  constructor(private http: HttpClient) {}
  getAllEmpAchievements(): Observable<any> {
    return this.http.get<any>(this.Api);
  }
}
