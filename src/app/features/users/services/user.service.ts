import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { ChangePasswordReq, User, UserReq } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUserUrl = `${environment.baseApiURL}/users`;
  constructor(private readonly httpClient: HttpClient) {}

  list(): Observable<Response<User[]>> {
    return this.httpClient.get<Response<User[]>>(this.baseUserUrl);
  }

  getById(id: string): Observable<Response<User>> {
    return this.httpClient.get<Response<User>>(`${this.baseUserUrl}/${id}`);
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

  changePassword(data: ChangePasswordReq): Observable<Response<User>> {
    return this.httpClient.put<Response<User>>(
      `${this.baseUserUrl}/change-password`,
      data
    );
  }

  resetPassword(userId: string): Observable<Response<string>> {
    return this.httpClient.post<Response<string>>(
      `${this.baseUserUrl}/${userId}/reset-password`,
      null
    );
  }
}
