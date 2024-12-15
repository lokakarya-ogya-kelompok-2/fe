import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import {
  GroupAttitudeSkill,
  GroupAttitudeSkillQueryParam,
  GroupAttitudeSkillRequest,
} from '../models/group-attitude-skill';

@Injectable({
  providedIn: 'root',
})
export class GroupAttitudeSkillService {
  private groupAttitudeSkillApiUrl = `${environment.baseApiURL}/group-attitude-skills`;
  constructor(private http: HttpClient) {}
  getGroupAttitudeSkills(
    param: GroupAttitudeSkillQueryParam = {}
  ): Observable<Response<GroupAttitudeSkill[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<GroupAttitudeSkill[]>>(
      this.groupAttitudeSkillApiUrl,
      { params }
    );
  }
  createGroupAttitudeSkills(
    groupAttitudeSkill: GroupAttitudeSkillRequest
  ): Observable<Response<GroupAttitudeSkill>> {
    return this.http.post<Response<GroupAttitudeSkill>>(
      this.groupAttitudeSkillApiUrl,
      groupAttitudeSkill
    );
  }
  updateGroupAttitudeSkills(
    groupAttitudeSkill: GroupAttitudeSkill
  ): Observable<Response<GroupAttitudeSkill>> {
    return this.http.put<Response<GroupAttitudeSkill>>(
      `${this.groupAttitudeSkillApiUrl}/${groupAttitudeSkill.id}`,
      groupAttitudeSkill
    );
  }
  deleteGroupAttitudeSkills(id: string): Observable<Response<void>> {
    return this.http.delete<Response<void>>(
      `${this.groupAttitudeSkillApiUrl}/${id}`
    );
  }
}
