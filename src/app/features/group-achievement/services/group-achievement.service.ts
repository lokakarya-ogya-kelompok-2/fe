import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GroupAchievement,
  GroupAchievementRequest,
} from '../model/group-achievement';

@Injectable({
  providedIn: 'root',
})
export class GroupAchievementService {
  private Api = 'http://localhost:8080/group-achievements';
  constructor(private http: HttpClient) {}

  getGroupAchievements(): Observable<any> {
    return this.http.get<any>(this.Api);
  }
  createGroupAchievement(
    groupAchievement: GroupAchievementRequest
  ): Observable<any> {
    return this.http.post<GroupAchievement>(this.Api, groupAchievement);
  }
  updateGroupAttitudeSkills(
    groupAchievement: GroupAchievement
  ): Observable<any> {
    return this.http.put<GroupAchievement>(
      `${this.Api}/${groupAchievement.id}`,
      groupAchievement
    );
  }
  deleteGroupAttitudeSkills(id: string): Observable<any> {
    return this.http.delete(`${this.Api}/${id}`);
  }
}