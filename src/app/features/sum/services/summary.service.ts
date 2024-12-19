import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import { Summary, SummaryQueryParam } from '../models/summary';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private Api = `${environment.baseApiURL}/assessment-summaries`;
  constructor(private http: HttpClient) {}

  getAllSummary(param: SummaryQueryParam): Observable<Response<Summary[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<Summary[]>>(this.Api, { params });
  }

  calculateSummary(
    userId: string,
    year: number
  ): Observable<Response<Summary>> {
    return this.http.get<Response<Summary>>(
      `${this.Api}/calculate/${userId}/${year}`
    );
  }
}
