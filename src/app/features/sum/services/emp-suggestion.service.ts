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
  constructor(private httpClient: HttpClient) {}
  list(param: EmpSuggestionQueryParam): Observable<Response<EmpSuggestion[]>> {
    const params = toHttpParam(param);
    return this.httpClient.get<Response<EmpSuggestion[]>>(this.Api, { params });
  }
  createSuggestion(
    empSuggestion: EmpSuggestionRequest[]
  ): Observable<Response<EmpSuggestion[]>> {
    return this.httpClient.post<Response<EmpSuggestion[]>>(
      `${this.Api}/bulk-create`,
      empSuggestion
    );
  }
  delete(id: string): Observable<Response<void>> {
    return this.httpClient.delete<Response<void>>(`${this.Api}/${id}`);
  }
  update(data: EmpSuggestionRequest): Observable<Response<EmpSuggestion>> {
    return this.httpClient.put<Response<EmpSuggestion>>(
      `${this.Api}/${data.id}`,
      data
    );
  }
}
