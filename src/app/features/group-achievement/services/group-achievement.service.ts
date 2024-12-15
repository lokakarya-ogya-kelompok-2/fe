import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import {
  GroupAchievement,
  GroupAchievementQueryParam,
  GroupAchievementRequest,
} from '../model/group-achievement';

@Injectable({
  providedIn: 'root',
})
export class GroupAchievementService {
  private groupAchievementApiUrl = `${environment.baseApiURL}/group-achievements`;
  constructor(private http: HttpClient) {}

  getGroupAchievements(
    param: GroupAchievementQueryParam = {}
  ): Observable<Response<GroupAchievement[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<GroupAchievement[]>>(
      this.groupAchievementApiUrl,
      { params }
    );
  }
  createGroupAchievement(
    groupAchievement: GroupAchievementRequest
  ): Observable<Response<GroupAchievement>> {
    return this.http.post<Response<GroupAchievement>>(
      this.groupAchievementApiUrl,
      groupAchievement
    );
  }
  updateGroupAttitudeSkills(
    groupAchievement: GroupAchievement
  ): Observable<any> {
    return this.http.put<GroupAchievement>(
      `${this.groupAchievementApiUrl}/${groupAchievement.id}`,
      groupAchievement
    );
  }
  deleteGroupAttitudeSkills(id: string): Observable<Response<void>> {
    return this.http.delete<Response<void>>(
      `${this.groupAchievementApiUrl}/${id}`
    );
  }
}
