import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EmpAttitudeSkill,
  EmpAttitudeSkillRequest,
} from '../models/emp-attitude-skill';

@Injectable({
  providedIn: 'root',
})
export class EmpAttitudeSkillsService {
  private Api = 'http://localhost:8080/emp-attitude-skills';
  constructor(private http: HttpClient) {}
  // get
  // create

  getEmpAttitudeSkill(): Observable<any> {
    return this.http.get<any>(this.Api);
  }
  createEmpAttitudeSkill(
    empAttitudeSkillRequest: EmpAttitudeSkillRequest[]
  ): Observable<EmpAttitudeSkill[]> {
    return this.http.post<EmpAttitudeSkill[]>(
      this.Api,
      empAttitudeSkillRequest
    );
  }
}
