import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getAllTechnicalSkills(): Observable<any> {
    return this.http.get(this.Api);
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
