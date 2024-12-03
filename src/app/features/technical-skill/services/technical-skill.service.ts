import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../shared/models/response';
import {
  TechnicalSkill,
  TechnicalSKillRequest,
} from '../models/technical-skill';

@Injectable({
  providedIn: 'root',
})
export class TechnicalSkillService {
  private Api = 'http://localhost:8080/technical-skills';
  constructor(private http: HttpClient) {}

  getAllTechnicalSkills(): Observable<Response<TechnicalSkill[]>> {
    return this.http.get<Response<TechnicalSkill[]>>(this.Api);
  }
  createTechnicalSkill(
    technicalSkillRequest: TechnicalSKillRequest
  ): Observable<TechnicalSkill> {
    return this.http.post<TechnicalSkill>(this.Api, technicalSkillRequest);
  }
  updateTechnicalSkill(
    technicalSkill: TechnicalSkill
  ): Observable<TechnicalSkill> {
    return this.http.put<TechnicalSkill>(
      `${this.Api}/${technicalSkill.id}`,
      technicalSkill
    );
  }
  deleteTechnicalSkill(id: string): Observable<any> {
    return this.http.delete(`${this.Api}/${id}`);
  }
}
