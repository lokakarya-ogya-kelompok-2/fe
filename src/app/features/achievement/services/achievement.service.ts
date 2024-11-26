import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Achievement, AchievementRequest } from '../model/achievement';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private Api = 'http://localhost:8080/achievements';
  constructor(private http: HttpClient) {}

  getAchievements(): Observable<any> {
    return this.http.get<any>(this.Api);
  }
  createAchievement(achievement: AchievementRequest): Observable<Achievement> {
    return this.http.post<Achievement>(this.Api, achievement);
  }
  updateAchievement(achievement: Achievement): Observable<Achievement> {
    return this.http.put<Achievement>(
      `${this.Api}/${achievement.id}`,
      achievement
    );
  }
  deleteAchievement(id: string): Observable<any> {
    return this.http.delete(`${this.Api}/${id}`);
  }
}
