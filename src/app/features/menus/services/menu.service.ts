import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Response } from '../../../shared/models/response';
import { Menu } from '../models/menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly baseMenuUrl = `${environment.baseApiURL}/menus`;
  constructor(private readonly httpClient: HttpClient) {}

  getMenuByUserId(userId: string): Observable<Response<Menu[]>> {
    return this.httpClient.get<Response<Menu[]>>(
      `${this.baseMenuUrl}/search?user_id=${userId}`
    );
  }
}
