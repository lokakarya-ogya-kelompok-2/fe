import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../shared/models/response';
import { AttitudeSkill, AttitudeSkillRequest } from '../models/attitude-skill';
@Injectable({
  providedIn: 'root',
})
export class AttitudeSkillService {
  private Api = 'http://localhost:8080/attitude-skills';
  constructor(private http: HttpClient) {}

  getAttitudeSkills(): Observable<Response<AttitudeSkill[]>> {
    return this.http.get<any>(this.Api);
  }
  createAttitudeSkill(
    attitudeSkill: AttitudeSkillRequest
  ): Observable<AttitudeSkill> {
    return this.http.post<AttitudeSkill>(this.Api, attitudeSkill);
  }
  updateAttitudeSkill(attitudeSkill: AttitudeSkill): Observable<AttitudeSkill> {
    console.log(attitudeSkill.id, 'ini dari service');
    return this.http.put<AttitudeSkill>(
      `${this.Api}/${attitudeSkill.id}`,
      attitudeSkill
    );
  }
  deleteAttitudeSkill(id: string): Observable<any> {
    return this.http.delete(`${this.Api}/${id}`);
  }
}
