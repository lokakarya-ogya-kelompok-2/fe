import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { User, UserReq } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUserUrl = `${environment.baseApiURL}/users`;
  constructor(private readonly httpClient: HttpClient) {}

  list(): Observable<Response<User[]>> {
    return this.httpClient.get<Response<User[]>>(this.baseUserUrl);
  }

  add(user: UserReq): Observable<Response<User>> {
    return this.httpClient.post<Response<User>>(this.baseUserUrl, user);
  }

  update(user: UserReq): Observable<Response<User>> {
    return this.httpClient.put<Response<User>>(
      `${this.baseUserUrl}/${user.id}`,
      user
    );
  }

  delete(id: string): Observable<Response<void>> {
    return this.httpClient.delete<Response<void>>(`${this.baseUserUrl}/${id}`);
  }
}
