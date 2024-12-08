import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../shared/models/response';
import { Summary } from '../models/summary';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private Api = 'http://localhost:8080/assessment-summaries';
  constructor(private http: HttpClient) {}

  getAllSummary(): Observable<Response<Summary[]>> {
    return this.http.get<Response<Summary[]>>(this.Api);
  }
}
