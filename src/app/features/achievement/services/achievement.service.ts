import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import {
  Achievement,
  AchievementQueryParam,
  AchievementRequest,
} from '../model/achievement';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private achievementApiUrl = `${environment.baseApiURL}/achievements`;
  constructor(private http: HttpClient) {}

  getAchievements(
    param: AchievementQueryParam = {}
  ): Observable<Response<Achievement[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<Achievement[]>>(this.achievementApiUrl, {
      params,
    });
  }
  createAchievement(achievement: AchievementRequest): Observable<Achievement> {
    return this.http.post<Achievement>(this.achievementApiUrl, achievement);
  }
  updateAchievement(achievement: Achievement): Observable<Achievement> {
    return this.http.put<Achievement>(
      `${this.achievementApiUrl}/${achievement.id}`,
      achievement
    );
  }
  deleteAchievement(id: string): Observable<Response<void>> {
    return this.http.delete<Response<void>>(`${this.achievementApiUrl}/${id}`);
  }
}
