import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Division, DivisionRequest } from '../models/division';

@Injectable({
  providedIn: 'root',
})
export class ManageDivisionService {
  private Api = 'http://localhost:8080/divisions';
  constructor(private http: HttpClient) {}
  getAllDivisions(): Observable<any> {
    return this.http.get<any>(this.Api);
  }
  createDivision(division: DivisionRequest): Observable<Division> {
    return this.http.post<Division>(this.Api, division);
  }
  updateDivision(division: Division): Observable<Division> {
    return this.http.put<Division>(`${this.Api}/${division.id}`, division);
  }
  deleteDivision(id: string): Observable<any> {
    console.log(id, 'ini dari service');
    return this.http.delete(`${this.Api}/${id}`);
  }
}
