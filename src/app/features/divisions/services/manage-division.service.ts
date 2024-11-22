import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ManageDivisionService {
  private Api = 'http://localhost:8080/divisions';
  constructor(private http: HttpClient) {}
  getPosts(): Observable<any> {
    return this.http.get<any>(this.Api);
  }
}
