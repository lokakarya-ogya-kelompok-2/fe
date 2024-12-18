import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { LoginRequest, LoginResponse } from '../login/models/login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private authUrl = environment.baseApiURL + '/auth';
  constructor(private readonly httpClient: HttpClient) {}

  login(data: LoginRequest): Observable<Response<LoginResponse>> {
    return this.httpClient.post<Response<LoginResponse>>(
      this.authUrl + '/login',
      data
    );
  }
}
