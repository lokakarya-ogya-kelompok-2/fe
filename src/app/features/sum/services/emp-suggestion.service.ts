import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../shared/models/response';
import { EmpSuggestion, EmpSuggestionRequest } from '../models/emp-suggestion';

@Injectable({
  providedIn: 'root',
})
export class EmpSuggestionService {
  private Api = 'http://localhost:8080/emp-suggestions';
  constructor(private http: HttpClient) {}
  createSuggestion(
    empSuggestion: EmpSuggestionRequest[]
  ): Observable<EmpSuggestion[]> {
    return this.http.post<EmpSuggestion[]>(
      `${this.Api}/bulk-create`,
      empSuggestion
    );
  }
  getByUserIdAndYear(
    userId: string,
    year: number
  ): Observable<Response<EmpSuggestion[]>> {
    return this.http.get<Response<EmpSuggestion[]>>(
      `${this.Api}?user_ids=${userId}&years=${year}`
    );
  }
}
