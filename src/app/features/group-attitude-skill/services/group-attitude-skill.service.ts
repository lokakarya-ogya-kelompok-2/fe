import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../shared/models/response';
import {
  GroupAttitudeSkill,
  GroupAttitudeSkillRequest,
} from '../models/group-attitude-skill';

@Injectable({
  providedIn: 'root',
})
export class GroupAttitudeSkillService {
  private Api = 'http://localhost:8080/group-attitude-skills';
  constructor(private http: HttpClient) {}
  getGroupAttitudeSkills(): Observable<Response<GroupAttitudeSkill[]>> {
    return this.http.get<Response<GroupAttitudeSkill[]>>(this.Api);
  }
  createGroupAttitudeSkills(
    groupAttitudeSkill: GroupAttitudeSkillRequest
  ): Observable<Response<GroupAttitudeSkill>> {
    return this.http.post<Response<GroupAttitudeSkill>>(
      this.Api,
      groupAttitudeSkill
    );
  }
  updateGroupAttitudeSkills(
    groupAttitudeSkill: GroupAttitudeSkill
  ): Observable<Response<GroupAttitudeSkill>> {
    return this.http.put<Response<GroupAttitudeSkill>>(
      `${this.Api}/${groupAttitudeSkill.id}`,
      groupAttitudeSkill
    );
  }
  deleteGroupAttitudeSkills(id: string): Observable<Response<void>> {
    return this.http.delete<Response<void>>(`${this.Api}/${id}`);
  }
}
