import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GroupAttitudeSkill,
  GroupAttitudeSkillRequest,
} from '../models/group-attitude-skill';

@Injectable({
  providedIn: 'root',
})
export class ManageGroupAttitudeSkillService {
  private Api = 'http://localhost:8080/group-attitude-skills';
  constructor(private http: HttpClient) {}
  getGroupAttitudeSkillss(): Observable<any> {
    return this.http.get<any>(this.Api);
  }
  createGroupAttitudeSkills(
    groupAttitudeSkill: GroupAttitudeSkillRequest
  ): Observable<any> {
    return this.http.post<GroupAttitudeSkill>(this.Api, groupAttitudeSkill);
  }
  updateGroupAttitudeSkills(
    groupAttitudeSkill: GroupAttitudeSkill
  ): Observable<any> {
    return this.http.put<GroupAttitudeSkill>(
      `${this.Api}/${groupAttitudeSkill.id}`,
      groupAttitudeSkill
    );
  }
  deleteGroupAttitudeSkills(id: string): Observable<any> {
    return this.http.delete(`${this.Api}/${id}`);
  }
}
