import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageGroupAttitudeSkillService {
  private Api= 'http://localhost:8080/group-attitude-skills'
  constructor(private http:HttpClient) { }
  getGroupAttitudeSkillss(): Observable<any>{
    return this.http.get<any>(this.Api);
  }
  
}
