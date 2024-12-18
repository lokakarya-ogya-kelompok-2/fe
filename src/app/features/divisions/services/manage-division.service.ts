import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { toHttpParam } from '../../../shared/utils/query-param';
import {
  Division,
  DivisionQueryParam,
  DivisionRequest,
} from '../models/division';
@Injectable({
  providedIn: 'root',
})
export class ManageDivisionService {
  private Api = `${environment.baseApiURL}/divisions`;
  constructor(private http: HttpClient) {}
  getAllDivisions(
    param: DivisionQueryParam = {}
  ): Observable<Response<Division[]>> {
    const params = toHttpParam(param);
    return this.http.get<Response<Division[]>>(this.Api, { params });
  }
  createDivision(division: DivisionRequest): Observable<Response<Division>> {
    return this.http.post<Response<Division>>(this.Api, division);
  }
  updateDivision(division: Division): Observable<Response<Division>> {
    return this.http.put<Response<Division>>(
      `${this.Api}/${division.id}`,
      division
    );
  }
  deleteDivision(id: string): Observable<Response<void>> {
    return this.http.delete<Response<void>>(`${this.Api}/${id}`);
  }
}
