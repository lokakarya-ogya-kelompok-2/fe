import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import {
  EmpSuggestion,
  EmpSuggestionQueryParam,
  EmpSuggestionRequest,
} from '../models/emp-suggestion';

@Injectable({
  providedIn: 'root',
})
export class EmpSuggestionService {
  private Api = `${environment.baseApiURL}/emp-suggestions`;
  constructor(private http: HttpClient) {}
  list(param: EmpSuggestionQueryParam): Observable<Response<EmpSuggestion[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<EmpSuggestion[]>>(this.Api, { params });
  }
  createSuggestion(
    empSuggestion: EmpSuggestionRequest[]
  ): Observable<Response<EmpSuggestion[]>> {
    return this.http.post<Response<EmpSuggestion[]>>(
      `${this.Api}/bulk-create`,
      empSuggestion
    );
  }
}
